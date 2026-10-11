import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Budget } from './entities/budget.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { Transaction } from '../transactions/entities/transaction.entity.js';
import { CategoriesService } from '../categories/categories.service.js';
import { UpsertBudgetDto } from './dto/upsert-budget.dto.js';

export type BudgetStatus = 'SAFE' | 'WARNING' | 'EXCEEDED';

export interface BudgetEnvelopeItem {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  month: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  usagePercentage: number;
  status: BudgetStatus;
}

export interface UnbudgetedCategoryItem {
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
  spentAmount: number;
}

export interface MonthlyBudgetSummary {
  month: string;
  totalBudgeted: number;
  totalSpentInBudgeted: number;
  totalSpentAllCategories: number;
  remainingBudget: number;
  overallUsagePercentage: number;
  overallStatus: BudgetStatus;
  envelopes: BudgetEnvelopeItem[];
  unbudgetedCategories: UnbudgetedCategoryItem[];
}

function getMonthDateRange(month: string): { startDate: string; endDate: string } {
  const parts = month.split('-');
  const year = Number(parts[0]);
  const monthIndex = Number(parts[1]);
  const lastDay = new Date(year, monthIndex, 0).getDate();
  return {
    startDate: `${month}-01`,
    endDate: `${month}-${String(lastDay).padStart(2, '0')}`,
  };
}

function computeBudgetStatus(usagePercentage: number): BudgetStatus {
  if (usagePercentage >= 100) return 'EXCEEDED';
  if (usagePercentage >= 80) return 'WARNING';
  return 'SAFE';
}

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepo: Repository<Budget>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findByMonth(
    userId: string,
    month?: string,
  ): Promise<MonthlyBudgetSummary> {
    const now = new Date();
    const effectiveMonth =
      month ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const { startDate, endDate } = getMonthDateRange(effectiveMonth);

    // Parallel execution: fetch expense categories, monthly budgets, and aggregated spending by category
    const [expenseCategories, budgets, rawSpendingRows] = await Promise.all([
      this.categoriesService.findAll(userId, 'EXPENSE'),
      this.budgetRepo.find({
        where: { userId, month: effectiveMonth },
        order: { createdAt: 'ASC' },
      }),
      this.transactionRepo
        .createQueryBuilder('tx')
        .select('tx.category_id', 'categoryId')
        .addSelect('COALESCE(SUM(tx.amount), 0)', 'spentAmount')
        .where('tx.user_id = :userId', { userId })
        .andWhere('tx.type = :type', { type: 'EXPENSE' })
        .andWhere('tx.transaction_date >= :startDate', { startDate })
        .andWhere('tx.transaction_date <= :endDate', { endDate })
        .groupBy('tx.category_id')
        .getRawMany<{ categoryId: string | null; spentAmount: string }>(),
    ]);

    // O(1) lookup maps
    const spendingByCategoryId = new Map<string, number>();
    let totalSpentAllCategories = 0;

    for (const row of rawSpendingRows) {
      const amount = Number(row.spentAmount || 0);
      totalSpentAllCategories += amount;
      if (row.categoryId) {
        spendingByCategoryId.set(row.categoryId, amount);
      }
    }

    const categoryMap = new Map<string, Category>();
    for (const cat of expenseCategories) {
      categoryMap.set(cat.id, cat);
    }

    const budgetedCategoryIds = new Set<string>();
    const envelopes: BudgetEnvelopeItem[] = [];
    let totalBudgeted = 0;
    let totalSpentInBudgeted = 0;

    for (const b of budgets) {
      const cat = categoryMap.get(b.categoryId);
      if (!cat) continue;

      budgetedCategoryIds.add(b.categoryId);
      const budgetAmount = b.amount;
      const spentAmount = spendingByCategoryId.get(b.categoryId) || 0;
      const remainingAmount = budgetAmount - spentAmount;
      const usagePercentage =
        budgetAmount > 0
          ? Math.round((spentAmount / budgetAmount) * 1000) / 10
          : 0;

      totalBudgeted += budgetAmount;
      totalSpentInBudgeted += spentAmount;

      envelopes.push({
        id: b.id,
        categoryId: b.categoryId,
        categoryName: cat.name,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        month: effectiveMonth,
        budgetAmount,
        spentAmount,
        remainingAmount,
        usagePercentage,
        status: computeBudgetStatus(usagePercentage),
      });
    }

    // Sort envelopes by highest usage percentage first so critical ones appear at the top
    envelopes.sort((a, b) => b.usagePercentage - a.usagePercentage);

    const unbudgetedCategories: UnbudgetedCategoryItem[] = [];
    for (const cat of expenseCategories) {
      if (!budgetedCategoryIds.has(cat.id)) {
        unbudgetedCategories.push({
          categoryId: cat.id,
          categoryName: cat.name,
          categoryIcon: cat.icon,
          categoryColor: cat.color,
          spentAmount: spendingByCategoryId.get(cat.id) || 0,
        });
      }
    }

    // Sort unbudgeted categories by spentAmount descending
    unbudgetedCategories.sort((a, b) => b.spentAmount - a.spentAmount);

    const remainingBudget = totalBudgeted - totalSpentInBudgeted;
    const overallUsagePercentage =
      totalBudgeted > 0
        ? Math.round((totalSpentInBudgeted / totalBudgeted) * 1000) / 10
        : 0;

    return {
      month: effectiveMonth,
      totalBudgeted,
      totalSpentInBudgeted,
      totalSpentAllCategories,
      remainingBudget,
      overallUsagePercentage,
      overallStatus: computeBudgetStatus(overallUsagePercentage),
      envelopes,
      unbudgetedCategories,
    };
  }

  async upsert(userId: string, dto: UpsertBudgetDto): Promise<Budget> {
    const categories = await this.categoriesService.findAll(
      userId,
      'EXPENSE',
    );
    const category = categories.find((c) => c.id === dto.categoryId);

    if (!category) {
      throw new BadRequestException(
        'Danh mục chi tiêu không tồn tại hoặc không thuộc quyền sở hữu của bạn',
      );
    }

    const existing = await this.budgetRepo.findOne({
      where: {
        userId,
        categoryId: dto.categoryId,
        month: dto.month,
      },
    });

    if (existing) {
      existing.amount = dto.amount;
      return this.budgetRepo.save(existing);
    }

    const created = this.budgetRepo.create({
      userId,
      categoryId: dto.categoryId,
      month: dto.month,
      amount: dto.amount,
    });

    return this.budgetRepo.save(created);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.budgetRepo.findOne({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy hạn mức ngân sách này');
    }

    await this.budgetRepo.remove(existing);
  }
}

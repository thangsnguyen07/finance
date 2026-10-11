import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BudgetsService } from './budgets.service.js';
import type { Budget } from './entities/budget.entity.js';
import type { Category } from '../categories/entities/category.entity.js';

describe('BudgetsService', () => {
  const userId = 'user-111';
  const mockCategories: Category[] = [
    {
      id: 'cat-food',
      userId,
      name: 'Ăn uống & Cà phê',
      type: 'EXPENSE',
      icon: 'utensils',
      color: '#B45309',
      isSystemDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'cat-rent',
      userId,
      name: 'Tiền nhà & Điện nước',
      type: 'EXPENSE',
      icon: 'home',
      color: '#1E3A8A',
      isSystemDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'cat-transport',
      userId,
      name: 'Di chuyển & Xăng xe',
      type: 'EXPENSE',
      icon: 'car',
      color: '#166534',
      isSystemDefault: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  let service: BudgetsService;
  let mockBudgetRepo: {
    find: ReturnType<typeof vi.fn>;
    findOne: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let mockQueryBuilder: {
    select: ReturnType<typeof vi.fn>;
    addSelect: ReturnType<typeof vi.fn>;
    where: ReturnType<typeof vi.fn>;
    andWhere: ReturnType<typeof vi.fn>;
    groupBy: ReturnType<typeof vi.fn>;
    getRawMany: ReturnType<typeof vi.fn>;
  };
  let mockTransactionRepo: {
    createQueryBuilder: ReturnType<typeof vi.fn>;
  };
  let mockCategoriesService: {
    findAll: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockBudgetRepo = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn((dto: Partial<Budget>) => ({ id: 'budget-new', ...dto })),
      save: vi.fn((entity: Budget) => Promise.resolve(entity)),
      remove: vi.fn(() => Promise.resolve(undefined)),
    };

    mockQueryBuilder = {
      select: vi.fn().mockReturnThis(),
      addSelect: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      andWhere: vi.fn().mockReturnThis(),
      groupBy: vi.fn().mockReturnThis(),
      getRawMany: vi.fn().mockResolvedValue([]),
    };

    mockTransactionRepo = {
      createQueryBuilder: vi.fn(() => mockQueryBuilder),
    };

    mockCategoriesService = {
      findAll: vi.fn().mockResolvedValue(mockCategories),
    };

    service = new BudgetsService(
      mockBudgetRepo as never,
      mockTransactionRepo as never,
      mockCategoriesService as never,
    );
  });

  it('aggregates monthly budgets and calculates SAFE, WARNING, and EXCEEDED statuses accurately', async () => {
    mockBudgetRepo.find.mockResolvedValue([
      {
        id: 'b-food',
        userId,
        categoryId: 'cat-food',
        month: '2026-10',
        amount: 4000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'b-rent',
        userId,
        categoryId: 'cat-rent',
        month: '2026-10',
        amount: 5000000,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    mockQueryBuilder.getRawMany.mockResolvedValue([
      { categoryId: 'cat-food', spentAmount: '3400000' }, // 85% -> WARNING
      { categoryId: 'cat-rent', spentAmount: '5200000' }, // 104% -> EXCEEDED
      { categoryId: 'cat-transport', spentAmount: '350000' }, // Unbudgeted
    ]);

    const summary = await service.findByMonth(userId, '2026-10');

    expect(summary.month).toBe('2026-10');
    expect(summary.totalBudgeted).toBe(9000000);
    expect(summary.totalSpentInBudgeted).toBe(8600000);
    expect(summary.totalSpentAllCategories).toBe(8950000);
    expect(summary.remainingBudget).toBe(400000);
    expect(summary.overallUsagePercentage).toBe(95.6);
    expect(summary.overallStatus).toBe('WARNING');

    expect(summary.envelopes).toHaveLength(2);
    // Sorted by usagePercentage descending: rent (104%) first, food (85%) second
    expect(summary.envelopes[0]?.categoryId).toBe('cat-rent');
    expect(summary.envelopes[0]?.status).toBe('EXCEEDED');
    expect(summary.envelopes[0]?.remainingAmount).toBe(-200000);

    expect(summary.envelopes[1]?.categoryId).toBe('cat-food');
    expect(summary.envelopes[1]?.status).toBe('WARNING');
    expect(summary.envelopes[1]?.usagePercentage).toBe(85);

    expect(summary.unbudgetedCategories).toHaveLength(1);
    expect(summary.unbudgetedCategories[0]?.categoryId).toBe('cat-transport');
    expect(summary.unbudgetedCategories[0]?.spentAmount).toBe(350000);
  });

  it('upserts a new budget or updates an existing budget for the same category and month', async () => {
    mockBudgetRepo.findOne.mockResolvedValueOnce(null);

    const created = await service.upsert(userId, {
      categoryId: 'cat-food',
      month: '2026-10',
      amount: 3500000,
    });

    expect(created.amount).toBe(3500000);
    expect(mockBudgetRepo.create).toHaveBeenCalledOnce();

    mockBudgetRepo.findOne.mockResolvedValueOnce({
      id: 'b-food',
      userId,
      categoryId: 'cat-food',
      month: '2026-10',
      amount: 3500000,
    });

    const updated = await service.upsert(userId, {
      categoryId: 'cat-food',
      month: '2026-10',
      amount: 4500000,
    });

    expect(updated.amount).toBe(4500000);
  });

  it('throws BadRequestException when upserting a budget for a non-existent category', async () => {
    await expect(
      service.upsert(userId, {
        categoryId: 'invalid-cat',
        month: '2026-10',
        amount: 2000000,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException when removing a non-existent budget', async () => {
    mockBudgetRepo.findOne.mockResolvedValue(null);

    await expect(service.remove(userId, 'missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});

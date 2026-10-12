import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  Account,
  type AccountType,
} from '../accounts/entities/account.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { QueryTransactionsDto } from './dto/query-transactions.dto.js';
import {
  Transaction,
  type TransactionType,
} from './entities/transaction.entity.js';

export interface PaginatedTransactionsResult {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function calculateBalanceDelta(
  accountType: AccountType,
  txType: TransactionType,
  amount: number,
  isTargetAccount = false,
): number {
  const isCreditCard = accountType === 'CREDIT_CARD';

  if (isTargetAccount) {
    // Target account in a TRANSFER receives money:
    // For Credit Card, receiving money pays down debt (-amount).
    // For Asset accounts (Cash/Bank), receiving money increases balance (+amount).
    return isCreditCard ? -amount : amount;
  }

  if (txType === 'INCOME') {
    // Income / Refund: reduces credit card debt (-amount) or increases asset balance (+amount).
    return isCreditCard ? -amount : amount;
  }

  // EXPENSE or source of TRANSFER: increases credit card debt (+amount) or decreases asset balance (-amount).
  return isCreditCard ? amount : -amount;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    userId: string,
    query: QueryTransactionsDto,
  ): Promise<PaginatedTransactionsResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 30;
    const skip = (page - 1) * limit;

    const qb = this.transactionsRepository
      .createQueryBuilder('tx')
      .leftJoinAndSelect('tx.account', 'account')
      .leftJoinAndSelect('tx.targetAccount', 'targetAccount')
      .leftJoinAndSelect('tx.category', 'category')
      .where('tx.userId = :userId', { userId });

    if (query.accountId) {
      qb.andWhere(
        '(tx.accountId = :accountId OR tx.targetAccountId = :accountId)',
        { accountId: query.accountId },
      );
    }

    if (query.categoryId) {
      qb.andWhere('tx.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.type) {
      qb.andWhere('tx.type = :type', { type: query.type });
    }

    if (query.startDate) {
      qb.andWhere('tx.transactionDate >= :startDate', {
        startDate: query.startDate,
      });
    }

    if (query.endDate) {
      qb.andWhere('tx.transactionDate <= :endDate', {
        endDate: query.endDate,
      });
    }

    qb.orderBy('tx.transactionDate', 'DESC')
      .addOrderBy('tx.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<Transaction> {
    if (dto.type === 'TRANSFER') {
      if (!dto.targetAccountId) {
        throw new BadRequestException(
          'targetAccountId is required for TRANSFER transactions',
        );
      }
      if (dto.accountId === dto.targetAccountId) {
        throw new BadRequestException(
          'Source and target accounts must be different',
        );
      }
    }

    return await this.dataSource.transaction(async (manager) => {
      const duplicate = await manager.findOne(Transaction, {
        where: { userId, clientTxId: dto.clientTxId },
      });

      if (duplicate) {
        throw new ConflictException(
          `Transaction with clientTxId "${dto.clientTxId}" already exists`,
        );
      }

      const sourceAccount = await manager.findOne(Account, {
        where: { id: dto.accountId, userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!sourceAccount) {
        throw new NotFoundException(
          `Account with ID "${dto.accountId}" not found`,
        );
      }

      let targetAccount: Account | null = null;
      if (dto.type === 'TRANSFER' && dto.targetAccountId) {
        targetAccount = await manager.findOne(Account, {
          where: { id: dto.targetAccountId, userId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!targetAccount) {
          throw new NotFoundException(
            `Target account with ID "${dto.targetAccountId}" not found`,
          );
        }

        targetAccount.currentBalance += calculateBalanceDelta(
          targetAccount.type,
          'TRANSFER',
          dto.amount,
          true,
        );
        await manager.save(Account, targetAccount);
      }

      let category: Category | null = null;
      if (dto.categoryId) {
        category = await manager.findOne(Category, {
          where: { id: dto.categoryId, userId },
        });
        if (!category) {
          throw new NotFoundException(
            `Category with ID "${dto.categoryId}" not found`,
          );
        }
      }

      sourceAccount.currentBalance += calculateBalanceDelta(
        sourceAccount.type,
        dto.type,
        dto.amount,
        false,
      );
      await manager.save(Account, sourceAccount);

      const transaction = manager.create(Transaction, {
        clientTxId: dto.clientTxId,
        userId,
        accountId: dto.accountId,
        targetAccountId:
          dto.type === 'TRANSFER' ? (dto.targetAccountId ?? null) : null,
        categoryId: dto.type !== 'TRANSFER' ? (dto.categoryId ?? null) : null,
        amount: dto.amount,
        type: dto.type,
        status: 'CLEARED',
        transactionDate: dto.transactionDate,
        description: dto.description?.trim() || null,
      });

      const saved = await manager.save(Transaction, transaction);
      saved.account = sourceAccount;
      saved.targetAccount = targetAccount;
      saved.category = category;
      return saved;
    });
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const tx = await manager.findOne(Transaction, {
        where: { id, userId },
      });

      if (!tx) {
        throw new NotFoundException(`Transaction with ID "${id}" not found`);
      }

      const sourceAccount = await manager.findOne(Account, {
        where: { id: tx.accountId, userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (sourceAccount) {
        sourceAccount.currentBalance -= calculateBalanceDelta(
          sourceAccount.type,
          tx.type,
          tx.amount,
          false,
        );
        await manager.save(Account, sourceAccount);
      }

      if (tx.type === 'TRANSFER' && tx.targetAccountId) {
        const targetAccount = await manager.findOne(Account, {
          where: { id: tx.targetAccountId, userId },
          lock: { mode: 'pessimistic_write' },
        });

        if (targetAccount) {
          targetAccount.currentBalance -= calculateBalanceDelta(
            targetAccount.type,
            'TRANSFER',
            tx.amount,
            true,
          );
          await manager.save(Account, targetAccount);
        }
      }

      await manager.remove(Transaction, tx);
    });
  }
}

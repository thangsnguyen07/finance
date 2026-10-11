import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  TransactionsService,
  calculateBalanceDelta,
} from './transactions.service.js';
import { Transaction } from './entities/transaction.entity.js';
import { Account } from '../accounts/entities/account.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import type { DataSource, EntityManager, Repository } from 'typeorm';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Partial<Repository<Transaction>>;
  let mockManager: Partial<EntityManager>;
  let mockDataSource: Partial<DataSource>;

  beforeEach(() => {
    repository = {};

    mockManager = {
      findOne: vi.fn(),
      create: vi.fn((_entityClass, plainObject) => plainObject as Transaction),
      save: vi.fn((_entityClass, entity) =>
        Promise.resolve({ id: 'tx-uuid-1', ...(entity as object) }),
      ) as unknown as EntityManager['save'],
      remove: vi.fn(() => Promise.resolve({})) as unknown as EntityManager['remove'],
    };

    mockDataSource = {
      transaction: vi.fn(async (cb: (manager: EntityManager) => Promise<unknown>) => {
        return await cb(mockManager as EntityManager);
      }) as unknown as DataSource['transaction'],
    };

    service = new TransactionsService(
      repository as Repository<Transaction>,
      mockDataSource as DataSource,
    );
  });

  describe('calculateBalanceDelta', () => {
    it('should deduct for EXPENSE and add for INCOME on normal asset accounts', () => {
      expect(calculateBalanceDelta('CASH', 'EXPENSE', 50000)).toBe(-50000);
      expect(calculateBalanceDelta('BANK', 'INCOME', 1000000)).toBe(1000000);
    });

    it('should increase debt for EXPENSE and decrease debt for INCOME/TRANSFER-target on CREDIT_CARD', () => {
      expect(calculateBalanceDelta('CREDIT_CARD', 'EXPENSE', 200000)).toBe(
        200000,
      );
      expect(calculateBalanceDelta('CREDIT_CARD', 'INCOME', 50000)).toBe(-50000);
      expect(
        calculateBalanceDelta('CREDIT_CARD', 'TRANSFER', 1000000, true),
      ).toBe(-1000000);
    });
  });

  describe('create', () => {
    it('should atomically log an EXPENSE and deduct source account balance', async () => {
      const cashAccount: Account = {
        id: 'acc-cash',
        userId: 'user-1',
        name: 'Tiền mặt',
        type: 'CASH',
        currency: 'VND',
        currentBalance: 500000,
        creditLimit: null,
        statementDay: null,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const foodCategory: Category = {
        id: 'cat-food',
        userId: 'user-1',
        name: 'Ăn uống',
        type: 'EXPENSE',
        icon: 'utensils',
        color: '#991B1B',
        isSystemDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockManager.findOne!)
        .mockResolvedValueOnce(null) // No duplicate clientTxId
        .mockResolvedValueOnce(cashAccount) // Source account
        .mockResolvedValueOnce(foodCategory); // Category

      const result = await service.create('user-1', {
        clientTxId: 'client-uuid-1',
        accountId: 'acc-cash',
        categoryId: 'cat-food',
        amount: 45000,
        type: 'EXPENSE',
        transactionDate: '2026-10-11',
        description: 'Cà phê sáng',
      });

      expect(cashAccount.currentBalance).toBe(455000);
      expect(result.amount).toBe(45000);
      expect(result.description).toBe('Cà phê sáng');
    });

    it('should atomically execute a TRANSFER from Bank to Credit Card and preserve Net Worth', async () => {
      const bankAccount = {
        id: 'acc-bank',
        userId: 'user-1',
        type: 'BANK',
        currentBalance: 10000000,
      } as Account;

      const creditCard = {
        id: 'acc-cc',
        userId: 'user-1',
        type: 'CREDIT_CARD',
        currentBalance: 2000000, // 2M debt
      } as Account;

      vi.mocked(mockManager.findOne!)
        .mockResolvedValueOnce(null) // Idempotency
        .mockResolvedValueOnce(bankAccount) // Source
        .mockResolvedValueOnce(creditCard); // Target

      await service.create('user-1', {
        clientTxId: 'client-uuid-transfer',
        accountId: 'acc-bank',
        targetAccountId: 'acc-cc',
        amount: 2000000,
        type: 'TRANSFER',
        transactionDate: '2026-10-11',
        description: 'Thanh toán sao kê thẻ tín dụng',
      });

      // Bank reduced by 2M (to 8M), Credit card debt reduced by 2M (to 0)
      // Net worth before: 10M - 2M = 8M. Net worth after: 8M - 0 = 8M.
      expect(bankAccount.currentBalance).toBe(8000000);
      expect(creditCard.currentBalance).toBe(0);
    });

    it('should throw ConflictException on duplicate clientTxId', async () => {
      vi.mocked(mockManager.findOne!).mockResolvedValueOnce({
        id: 'existing-tx',
        clientTxId: 'dup-id',
      } as Transaction);

      await expect(
        service.create('user-1', {
          clientTxId: 'dup-id',
          accountId: 'acc-1',
          amount: 50000,
          type: 'EXPENSE',
          transactionDate: '2026-10-11',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if TRANSFER has same source and target account', async () => {
      await expect(
        service.create('user-1', {
          clientTxId: 'tx-invalid',
          accountId: 'acc-1',
          targetAccountId: 'acc-1',
          amount: 100000,
          type: 'TRANSFER',
          transactionDate: '2026-10-11',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should revert account balance when deleting an EXPENSE transaction', async () => {
      const existingTx = {
        id: 'tx-1',
        userId: 'user-1',
        accountId: 'acc-cash',
        amount: 100000,
        type: 'EXPENSE',
      } as Transaction;

      const cashAccount = {
        id: 'acc-cash',
        userId: 'user-1',
        type: 'CASH',
        currentBalance: 400000,
      } as Account;

      vi.mocked(mockManager.findOne!)
        .mockResolvedValueOnce(existingTx)
        .mockResolvedValueOnce(cashAccount);

      await service.remove('user-1', 'tx-1');

      expect(cashAccount.currentBalance).toBe(500000);
      expect(mockManager.remove).toHaveBeenCalledWith(Transaction, existingTx);
    });

    it('should throw NotFoundException when deleting non-existent transaction', async () => {
      vi.mocked(mockManager.findOne!).mockResolvedValueOnce(null);

      await expect(service.remove('user-1', 'missing-tx')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

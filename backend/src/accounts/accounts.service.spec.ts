import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AccountsService } from './accounts.service.js';
import { Account } from './entities/account.entity.js';
import type { Repository } from 'typeorm';

describe('AccountsService', () => {
  let service: AccountsService;
  let repository: Partial<Repository<Account>>;

  beforeEach(() => {
    repository = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn((entity) => entity as Account),
      save: vi.fn((entity) =>
        Promise.resolve({ id: 'acc-uuid-1', ...(entity as object) } as Account),
      ),
    };

    service = new AccountsService(repository as Repository<Account>);
  });

  describe('findAll', () => {
    it('should auto-provision a default 0 VND Cash wallet when user has zero accounts', async () => {
      vi.mocked(repository.find!).mockResolvedValueOnce([]);

      const result = await service.findAll('user-1');

      expect(repository.find).toHaveBeenCalledWith({
        where: { user_id: 'user-1', is_archived: false },
        order: { created_at: 'ASC' },
      });
      expect(repository.create).toHaveBeenCalledWith({
        user_id: 'user-1',
        name: 'Tiền mặt',
        type: 'CASH',
        currency: 'VND',
        current_balance: 0,
        is_archived: false,
      });
      expect(repository.save).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Tiền mặt');
      expect(result[0].current_balance).toBe(0);
    });

    it('should return existing accounts without creating a new one', async () => {
      const existingAccounts = [
        {
          id: 'acc-1',
          user_id: 'user-1',
          name: 'Techcombank',
          type: 'BANK',
          currency: 'VND',
          current_balance: 5000000,
          credit_limit: null,
          statement_day: null,
          is_archived: false,
          created_at: new Date(),
          updated_at: new Date(),
        } as Account,
      ];
      vi.mocked(repository.find!).mockResolvedValueOnce(existingAccounts);

      const result = await service.findAll('user-1');

      expect(repository.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingAccounts);
    });
  });

  describe('create', () => {
    it('should successfully create an account', async () => {
      vi.mocked(repository.findOne!).mockResolvedValueOnce(null);

      const dto = {
        name: 'VPBank StepUp',
        type: 'CREDIT_CARD' as const,
        initial_balance: 0,
        credit_limit: 20000000,
        statement_day: 20,
      };

      const result = await service.create('user-1', dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { user_id: 'user-1', name: 'VPBank StepUp' },
      });
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          name: 'VPBank StepUp',
          type: 'CREDIT_CARD',
          current_balance: 0,
          credit_limit: 20000000,
          statement_day: 20,
        }),
      );
      expect(result.name).toBe('VPBank StepUp');
    });

    it('should throw ConflictException if account name already exists for user', async () => {
      vi.mocked(repository.findOne!).mockResolvedValueOnce({
        id: 'acc-existing',
        user_id: 'user-1',
        name: 'Tiền mặt',
      } as Account);

      await expect(
        service.create('user-1', {
          name: 'Tiền mặt',
          type: 'CASH',
          initial_balance: 0,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return account when found', async () => {
      const account = { id: 'acc-1', user_id: 'user-1', name: 'Tiền mặt' } as Account;
      vi.mocked(repository.findOne!).mockResolvedValueOnce(account);

      const result = await service.findOne('user-1', 'acc-1');
      expect(result).toEqual(account);
    });

    it('should throw NotFoundException when account does not exist', async () => {
      vi.mocked(repository.findOne!).mockResolvedValueOnce(null);

      await expect(service.findOne('user-1', 'missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update account attributes', async () => {
      const account = {
        id: 'acc-1',
        user_id: 'user-1',
        name: 'Ví Tiền',
        credit_limit: null,
      } as Account;
      vi.mocked(repository.findOne!).mockResolvedValueOnce(account);

      const result = await service.update('user-1', 'acc-1', {
        name: 'Ví Tiền Mặt',
      });

      expect(result.name).toBe('Ví Tiền Mặt');
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft-delete/archive the account', async () => {
      const account = {
        id: 'acc-1',
        user_id: 'user-1',
        name: 'Ví Cũ',
        is_archived: false,
      } as Account;
      vi.mocked(repository.findOne!).mockResolvedValueOnce(account);

      await service.remove('user-1', 'acc-1');

      expect(account.is_archived).toBe(true);
      expect(repository.save).toHaveBeenCalledWith(account);
    });
  });
});

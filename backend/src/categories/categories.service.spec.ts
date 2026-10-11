import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  CategoriesService,
  DEFAULT_CATEGORIES,
} from './categories.service.js';
import { Category } from './entities/category.entity.js';
import type { Repository } from 'typeorm';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Partial<Repository<Category>>;

  beforeEach(() => {
    repository = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn((entity) => entity as Category),
      save: vi.fn((entity) => {
        if (Array.isArray(entity)) {
          return Promise.resolve(
            entity.map((item, idx) => ({
              id: `cat-${idx}`,
              ...(item as object),
            })) as Category[],
          );
        }
        return Promise.resolve({
          id: 'cat-custom-1',
          ...(entity as object),
        } as Category);
      }) as unknown as Repository<Category>['save'],
    };

    service = new CategoriesService(repository as Repository<Category>);
  });

  describe('findAll', () => {
    it('should auto-seed default Vietnamese categories when user has none', async () => {
      vi.mocked(repository.find!).mockResolvedValueOnce([]);

      const result = await service.findAll('user-1');

      expect(repository.create).toHaveBeenCalledTimes(DEFAULT_CATEGORIES.length);
      expect(repository.save).toHaveBeenCalledOnce();
      expect(result).toHaveLength(DEFAULT_CATEGORIES.length);
    });

    it('should filter by type when requested', async () => {
      vi.mocked(repository.find!).mockResolvedValueOnce([]);

      const expenseCategories = await service.findAll('user-1', 'EXPENSE');

      expect(expenseCategories.every((c) => c.type === 'EXPENSE')).toBe(true);
      expect(expenseCategories.length).toBeGreaterThan(0);
    });
  });

  describe('create', () => {
    it('should create a new user custom category', async () => {
      vi.mocked(repository.findOne!).mockResolvedValueOnce(null);

      const result = await service.create('user-1', {
        name: 'Nuôi thú cưng',
        type: 'EXPENSE',
        icon: 'dog',
        color: '#991B1B',
      });

      expect(result.name).toBe('Nuôi thú cưng');
      expect(result.isSystemDefault).toBe(false);
    });

    it('should throw ConflictException when duplicate category exists', async () => {
      vi.mocked(repository.findOne!).mockResolvedValueOnce({
        id: 'existing-1',
        name: 'Tiền lương',
        type: 'INCOME',
      } as Category);

      await expect(
        service.create('user-1', {
          name: 'Tiền lương',
          type: 'INCOME',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if category is missing', async () => {
      vi.mocked(repository.findOne!).mockResolvedValueOnce(null);

      await expect(service.findOne('user-1', 'missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

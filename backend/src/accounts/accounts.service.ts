import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';
import { Account } from './entities/account.entity.js';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  /**
   * Returns all accounts belonging to the authenticated user.
   * Auto-provisions a blank 0 ₫ Cash wallet on first user access.
   */
  async findAll(userId: string, includeArchived = false): Promise<Account[]> {
    let accounts = await this.accountRepository.find({
      where: {
        userId,
        ...(includeArchived ? {} : { isArchived: false }),
      },
      order: {
        createdAt: 'ASC',
      },
    });

    // Auto-provision 1 default 0 ₫ Cash wallet if user has never created an account
    if (accounts.length === 0 && !includeArchived) {
      const defaultCashAccount = this.accountRepository.create({
        userId,
        name: 'Tiền mặt',
        type: 'CASH',
        currency: 'VND',
        currentBalance: 0,
        isArchived: false,
      });

      await this.accountRepository.save(defaultCashAccount);
      accounts = [defaultCashAccount];
    }

    return accounts;
  }

  async findOne(userId: string, id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID '${id}' not found`);
    }

    return account;
  }

  async create(userId: string, dto: CreateAccountDto): Promise<Account> {
    const existing = await this.accountRepository.findOne({
      where: { userId, name: dto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Account with name '${dto.name}' already exists`,
      );
    }

    const account = this.accountRepository.create({
      userId,
      name: dto.name,
      type: dto.type,
      currency: dto.currency || 'VND',
      currentBalance: dto.initialBalance || 0,
      creditLimit: dto.creditLimit ?? null,
      statementDay: dto.statementDay ?? null,
      isArchived: false,
    });

    return await this.accountRepository.save(account);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateAccountDto,
  ): Promise<Account> {
    const account = await this.findOne(userId, id);

    if (dto.name && dto.name !== account.name) {
      const existing = await this.accountRepository.findOne({
        where: { userId, name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Account with name '${dto.name}' already exists`,
        );
      }
      account.name = dto.name;
    }

    if (dto.creditLimit !== undefined) {
      account.creditLimit = dto.creditLimit;
    }

    if (dto.statementDay !== undefined) {
      account.statementDay = dto.statementDay;
    }

    if (dto.isArchived !== undefined) {
      account.isArchived = dto.isArchived;
    }

    return await this.accountRepository.save(account);
  }

  async remove(userId: string, id: string): Promise<void> {
    const account = await this.findOne(userId, id);
    // Soft delete / archive to preserve transaction relational history
    account.isArchived = true;
    await this.accountRepository.save(account);
  }
}

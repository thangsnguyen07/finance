import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';

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
  async findAll(
    userId: string,
    includeArchived = false,
  ): Promise<Account[]> {
    let accounts = await this.accountRepository.find({
      where: {
        user_id: userId,
        ...(includeArchived ? {} : { is_archived: false }),
      },
      order: {
        created_at: 'ASC',
      },
    });

    // Auto-provision 1 default 0 ₫ Cash wallet if user has never created an account
    if (accounts.length === 0 && !includeArchived) {
      const defaultCashAccount = this.accountRepository.create({
        user_id: userId,
        name: 'Tiền mặt',
        type: 'CASH',
        currency: 'VND',
        current_balance: 0,
        is_archived: false,
      });

      await this.accountRepository.save(defaultCashAccount);
      accounts = [defaultCashAccount];
    }

    return accounts;
  }

  async findOne(userId: string, id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!account) {
      throw new NotFoundException(`Account with ID '${id}' not found`);
    }

    return account;
  }

  async create(userId: string, dto: CreateAccountDto): Promise<Account> {
    const existing = await this.accountRepository.findOne({
      where: { user_id: userId, name: dto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Account with name '${dto.name}' already exists`,
      );
    }

    const account = this.accountRepository.create({
      user_id: userId,
      name: dto.name,
      type: dto.type,
      currency: dto.currency || 'VND',
      current_balance: dto.initial_balance || 0,
      credit_limit: dto.credit_limit ?? null,
      statement_day: dto.statement_day ?? null,
      is_archived: false,
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
        where: { user_id: userId, name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(
          `Account with name '${dto.name}' already exists`,
        );
      }
      account.name = dto.name;
    }

    if (dto.credit_limit !== undefined) {
      account.credit_limit = dto.credit_limit;
    }

    if (dto.statement_day !== undefined) {
      account.statement_day = dto.statement_day;
    }

    if (dto.is_archived !== undefined) {
      account.is_archived = dto.is_archived;
    }

    return await this.accountRepository.save(account);
  }

  async remove(userId: string, id: string): Promise<void> {
    const account = await this.findOne(userId, id);
    // Soft delete / archive to preserve transaction relational history
    account.is_archived = true;
    await this.accountRepository.save(account);
  }
}

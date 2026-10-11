import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity.js';
import { Account } from '../accounts/entities/account.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { TransactionsService } from './transactions.service.js';
import { TransactionsController } from './transactions.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, Category])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}

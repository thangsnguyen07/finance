import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from './entities/budget.entity.js';
import { Transaction } from '../transactions/entities/transaction.entity.js';
import { CategoriesModule } from '../categories/categories.module.js';
import { BudgetsService } from './budgets.service.js';
import { BudgetsController } from './budgets.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, Transaction]),
    CategoriesModule,
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
  exports: [BudgetsService],
})
export class BudgetsModule {}

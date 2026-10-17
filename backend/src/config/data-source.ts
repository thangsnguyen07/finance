import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Account } from '../accounts/entities/account.entity.js';
import { Budget } from '../budgets/entities/budget.entity.js';
import { Category } from '../categories/entities/category.entity.js';
import { InitialSchema1729200000000 } from '../migrations/1729200000000-InitialSchema.js';
import { Transaction } from '../transactions/entities/transaction.entity.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/finance_db',
  ssl:
    process.env.DATABASE_SSL === 'true' || process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: [Account, Category, Transaction, Budget],
  migrations: [InitialSchema1729200000000],
  synchronize: false,
});

export default AppDataSource;

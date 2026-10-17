import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccountsModule } from './accounts/accounts.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BudgetsModule } from './budgets/budgets.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';

@Module({
  imports: [
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    BudgetsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '../.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<string>('NODE_ENV') === 'production';
        const useSsl =
          configService.get<string>('DATABASE_SSL') === 'true' || isProd;
        return {
          type: 'postgres',
          url: configService.get<string>(
            'DATABASE_URL',
            'postgresql://postgres:postgres@localhost:5432/finance_db',
          ),
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: !isProd,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

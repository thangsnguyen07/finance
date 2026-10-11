import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import type { TransactionType } from '../entities/transaction.entity.js';

export class QueryTransactionsDto {
  @ApiPropertyOptional({ description: 'Filter by account UUID' })
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @ApiPropertyOptional({ description: 'Filter by category UUID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ['INCOME', 'EXPENSE', 'TRANSFER'] })
  @IsOptional()
  @IsIn(['INCOME', 'EXPENSE', 'TRANSFER'])
  type?: TransactionType;

  @ApiPropertyOptional({ description: 'Filter start date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter end date (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 30, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;
}

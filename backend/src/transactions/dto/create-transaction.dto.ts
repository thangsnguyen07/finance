import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { TransactionType } from '../entities/transaction.entity.js';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Client-generated idempotency identifier (UUID v4)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  clientTxId: string;

  @ApiProperty({
    description: 'Source account/wallet UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  accountId: string;

  @ApiPropertyOptional({
    description: 'Target account/wallet UUID (Required for TRANSFER)',
  })
  @IsOptional()
  @IsUUID()
  targetAccountId?: string;

  @ApiPropertyOptional({
    description: 'Category UUID (For EXPENSE and INCOME)',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiProperty({
    description: 'Transaction amount in integer VND (> 0)',
    example: 50000,
  })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({
    enum: ['INCOME', 'EXPENSE', 'TRANSFER'],
    example: 'EXPENSE',
  })
  @IsIn(['INCOME', 'EXPENSE', 'TRANSFER'])
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction date in YYYY-MM-DD format',
    example: '2026-10-11',
  })
  @IsDateString()
  transactionDate: string;

  @ApiPropertyOptional({
    description: 'Optional note or memo',
    example: 'Cà phê sáng & Bánh mì',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

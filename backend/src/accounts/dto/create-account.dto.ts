import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import type { AccountType } from '../entities/account.entity.js';

export class CreateAccountDto {
  @ApiProperty({
    description: 'Name of the wallet or account',
    example: 'Ví Tiền mặt',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    enum: ['CASH', 'BANK', 'CREDIT_CARD', 'E_WALLET', 'INVESTMENT'],
    example: 'CASH',
  })
  @IsIn(['CASH', 'BANK', 'CREDIT_CARD', 'E_WALLET', 'INVESTMENT'])
  type: AccountType;

  @ApiProperty({
    description: 'Initial balance in integer VND',
    example: 0,
  })
  @IsInt()
  initialBalance: number;

  @ApiPropertyOptional({ default: 'VND', example: 'VND' })
  @IsOptional()
  @IsString()
  currency?: string = 'VND';

  @ApiPropertyOptional({
    description: 'Credit limit in VND for credit card accounts',
    example: 20000000,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({
    description: 'Statement closing day of month (1-31)',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  statementDay?: number;
}

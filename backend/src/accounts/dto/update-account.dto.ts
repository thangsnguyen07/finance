import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateAccountDto {
  @ApiPropertyOptional({
    description: 'Updated name of the account',
    example: 'Ví Tiền mặt chính',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Updated credit limit in VND',
    example: 30000000,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({
    description: 'Updated statement closing day (1-31)',
    example: 25,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  statementDay?: number;

  @ApiPropertyOptional({
    description: 'Whether account is archived',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}

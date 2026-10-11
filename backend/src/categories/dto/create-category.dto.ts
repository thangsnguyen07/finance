import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { CategoryType } from '../entities/category.entity.js';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Ăn uống & Cà phê',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    enum: ['INCOME', 'EXPENSE'],
    example: 'EXPENSE',
  })
  @IsIn(['INCOME', 'EXPENSE'])
  type: CategoryType;

  @ApiPropertyOptional({
    description: 'Lucide icon name',
    example: 'utensils',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({
    description: 'Hex color code',
    example: '#991B1B',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;
}

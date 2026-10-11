import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Category, type CategoryType } from './entities/category.entity.js';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all default and user categories' })
  @ApiResponse({ status: 200, description: 'List of categories' })
  async findAll(
    @CurrentUser() userId: string,
    @Query('type') type?: CategoryType,
  ): Promise<Category[]> {
    const validType =
      type === 'INCOME' || type === 'EXPENSE' ? type : undefined;
    return await this.categoriesService.findAll(userId, validType);
  }

  @Post()
  @ApiOperation({ summary: 'Create a custom user category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 409, description: 'Category already exists' })
  async create(
    @CurrentUser() userId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.create(userId, createCategoryDto);
  }
}

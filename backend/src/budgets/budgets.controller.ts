import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import {
  BudgetsService,
  type MonthlyBudgetSummary,
} from './budgets.service.js';
import { QueryBudgetsDto } from './dto/query-budgets.dto.js';
import { UpsertBudgetDto } from './dto/upsert-budget.dto.js';
import { Budget } from './entities/budget.entity.js';

@ApiTags('budgets')
@ApiBearerAuth()
@Controller('api/v1/budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get monthly budget envelopes and spending summary',
  })
  @ApiResponse({ status: 200, description: 'Monthly budget summary' })
  async findByMonth(
    @CurrentUser() userId: string,
    @Query() query: QueryBudgetsDto,
  ): Promise<MonthlyBudgetSummary> {
    return await this.budgetsService.findByMonth(userId, query.month);
  }

  @Post()
  @ApiOperation({ summary: 'Create or update a monthly category budget' })
  @ApiResponse({ status: 201, description: 'Budget upserted successfully' })
  async upsert(
    @CurrentUser() userId: string,
    @Body() dto: UpsertBudgetDto,
  ): Promise<Budget> {
    return await this.budgetsService.upsert(userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a monthly category budget' })
  @ApiResponse({ status: 204, description: 'Budget deleted' })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.budgetsService.remove(userId, id);
  }
}

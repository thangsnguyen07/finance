import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { QueryTransactionsDto } from './dto/query-transactions.dto.js';
import { Transaction } from './entities/transaction.entity.js';
import {
  TransactionsService,
  type PaginatedTransactionsResult,
} from './transactions.service.js';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('api/v1/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: 'List paginated and filtered transactions' })
  @ApiResponse({ status: 200, description: 'Paginated transaction list' })
  async findAll(
    @CurrentUser() userId: string,
    @Query() query: QueryTransactionsDto,
  ): Promise<PaginatedTransactionsResult> {
    return await this.transactionsService.findAll(userId, query);
  }

  @Post()
  @ApiOperation({
    summary:
      'Log an income, expense, or transfer and update balances atomically',
  })
  @ApiResponse({ status: 201, description: 'Transaction logged successfully' })
  @ApiResponse({ status: 409, description: 'Duplicate clientTxId' })
  async create(
    @CurrentUser() userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return await this.transactionsService.create(userId, createTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a transaction and revert its balance impact atomically',
  })
  @ApiResponse({
    status: 204,
    description: 'Transaction deleted and balances restored',
  })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.transactionsService.remove(userId, id);
  }
}

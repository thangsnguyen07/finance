import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Account } from './entities/account.entity.js';
import { AccountsService } from './accounts.service.js';
import { CreateAccountDto } from './dto/create-account.dto.js';
import { UpdateAccountDto } from './dto/update-account.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('api/v1/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'List all accounts for authenticated user' })
  @ApiResponse({ status: 200, description: 'List of accounts' })
  async findAll(
    @CurrentUser() userId: string,
    @Query('include_archived') includeArchived?: string,
  ): Promise<Account[]> {
    const shouldIncludeArchived = includeArchived === 'true';
    return await this.accountsService.findAll(userId, shouldIncludeArchived);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new account/wallet' })
  @ApiResponse({ status: 201, description: 'Account created successfully' })
  @ApiResponse({ status: 409, description: 'Account with same name already exists' })
  async create(
    @CurrentUser() userId: string,
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<Account> {
    return await this.accountsService.create(userId, createAccountDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account details by ID' })
  @ApiResponse({ status: 200, description: 'Account found' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findOne(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Account> {
    return await this.accountsService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update mutable account attributes' })
  @ApiResponse({ status: 200, description: 'Account updated successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async update(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return await this.accountsService.update(userId, id, updateAccountDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Archive/soft-delete an account' })
  @ApiResponse({ status: 204, description: 'Account archived successfully' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async remove(
    @CurrentUser() userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.accountsService.remove(userId, id);
  }
}

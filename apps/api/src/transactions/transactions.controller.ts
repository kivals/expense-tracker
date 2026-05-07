import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import type { Transaction, TransactionsListResponse } from '@expense-tracker/shared-types';
import type { PublicUser } from '@expense-tracker/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions.query.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() dto: CreateTransactionDto,
    @CurrentUser() user: PublicUser,
  ): Promise<Transaction> {
    return this.transactionsService.create(dto, user.id);
  }

  @Get()
  findAll(
    @Query() filter: ListTransactionsQueryDto,
    @CurrentUser() user: PublicUser,
  ): Promise<TransactionsListResponse> {
    return this.transactionsService.findAll(user.id, filter);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: PublicUser,
  ): Promise<Transaction> {
    const transaction = await this.transactionsService.findOne(id);
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.userId !== user.id) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
    @CurrentUser() user: PublicUser,
  ): Promise<Transaction> {
    return this.transactionsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: PublicUser,
  ): Promise<void> {
    return this.transactionsService.remove(id, user.id);
  }
}

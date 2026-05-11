import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Transaction, TransactionsListResponse } from '@expense-tracker/shared-types';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions.query.dto';
import { CreateTransactionCommand } from './commands/create-transaction.command';
import { UpdateTransactionCommand } from './commands/update-transaction.command';
import { DeleteTransactionCommand } from './commands/delete-transaction.command';
import { GetTransactionsByUserQuery } from './queries/get-transactions-by-user.query';
import { GetTransactionByIdQuery } from './queries/get-transaction-by-id.query';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  create(dto: CreateTransactionDto, userId: string): Promise<Transaction> {
    return this.commandBus.execute(
      new CreateTransactionCommand(dto.amount, dto.type, dto.description, dto.date, dto.categoryId, userId),
    );
  }

  findAll(userId: string, filter: ListTransactionsQueryDto): Promise<TransactionsListResponse> {
    return this.queryBus.execute(
      new GetTransactionsByUserQuery(
        userId,
        filter.month,
        filter.year,
        filter.page ?? 1,
        filter.limit ?? 20,
      ),
    );
  }

  findOne(id: string): Promise<Transaction | null> {
    return this.queryBus.execute(new GetTransactionByIdQuery(id));
  }

  update(id: string, dto: UpdateTransactionDto, userId: string): Promise<Transaction> {
    return this.commandBus.execute(
      new UpdateTransactionCommand(id, userId, dto.amount, dto.type, dto.description, dto.date, dto.categoryId),
    );
  }

  remove(id: string, userId: string): Promise<void> {
    return this.commandBus.execute(new DeleteTransactionCommand(id, userId));
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { Transaction } from '@expense-tracker/shared-types';
import { PrismaService } from '../../../prisma/prisma.service';
import { GetTransactionByIdQuery } from '../get-transaction-by-id.query';

@QueryHandler(GetTransactionByIdQuery)
export class GetTransactionByIdHandler
  implements IQueryHandler<GetTransactionByIdQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetTransactionByIdQuery): Promise<Transaction | null> {
    const t = await this.prisma.transaction.findUnique({ where: { id: query.id } });
    if (!t) return null;
    return {
      ...t,
      amount: t.amount.toString(),
      date: t.date.toISOString(),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    };
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { TransactionsListResponse } from '@expense-tracker/shared-types';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { GetTransactionsByUserQuery } from '../get-transactions-by-user.query';

@QueryHandler(GetTransactionsByUserQuery)
export class GetTransactionsByUserHandler
  implements IQueryHandler<GetTransactionsByUserQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetTransactionsByUserQuery): Promise<TransactionsListResponse> {
    const where: Prisma.TransactionWhereInput = { userId: query.userId };

    if (query.year !== undefined) {
      const start = query.month !== undefined
        ? new Date(Date.UTC(query.year, query.month - 1, 1))
        : new Date(Date.UTC(query.year, 0, 1));
      const end = query.month !== undefined
        ? new Date(Date.UTC(query.year, query.month, 1))
        : new Date(Date.UTC(query.year + 1, 0, 1));
      where.date = { gte: start, lt: end };
    }

    const [items, agg] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({ where, orderBy: { date: 'desc' } }),
      this.prisma.transaction.groupBy({
        by: ['type'],
        where,
        orderBy: { type: 'asc' },
        _sum: { amount: true },
      }),
    ]);

    const incomeRow = agg.find((g) => g.type === 'income');
    const expenseRow = agg.find((g) => g.type === 'expense');
    const totalIncome = (incomeRow?._sum?.amount ?? 0).toString();
    const totalExpense = (expenseRow?._sum?.amount ?? 0).toString();
    const balance = (Number(totalIncome) - Number(totalExpense)).toFixed(2);

    return {
      items: items.map((t) => ({
        ...t,
        amount: t.amount.toString(),
        date: t.date.toISOString(),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
      aggregate: { totalIncome, totalExpense, balance },
    };
  }
}

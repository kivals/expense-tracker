import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Transaction } from '@expense-tracker/shared-types';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTransactionCommand } from '../create-transaction.command';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    const category = await this.prisma.category.findUnique({
      where: { id: command.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        amount: command.amount,
        type: command.type,
        description: command.description,
        date: new Date(command.date),
        categoryId: command.categoryId,
        userId: command.userId,
      },
    });

    return { ...transaction, amount: transaction.amount.toString(), date: transaction.date.toISOString(), createdAt: transaction.createdAt.toISOString(), updatedAt: transaction.updatedAt.toISOString() };
  }
}

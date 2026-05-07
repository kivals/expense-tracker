import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Transaction } from '@expense-tracker/shared-types';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateTransactionCommand } from '../update-transaction.command';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UpdateTransactionCommand): Promise<Transaction> {
    const existing = await this.prisma.transaction.findUnique({
      where: { id: command.id },
    });

    if (!existing) {
      throw new NotFoundException('Transaction not found');
    }

    if (existing.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    if (command.categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({
        where: { id: command.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      if (category.userId !== command.userId) throw new ForbiddenException('Access denied');
    }

    const transaction = await this.prisma.transaction.update({
      where: { id: command.id },
      data: {
        ...(command.amount !== undefined && { amount: command.amount }),
        ...(command.type !== undefined && { type: command.type }),
        ...(command.description !== undefined && { description: command.description }),
        ...(command.date !== undefined && { date: new Date(command.date) }),
        ...(command.categoryId !== undefined && { categoryId: command.categoryId }),
      },
    });

    return { ...transaction, amount: transaction.amount.toString(), date: transaction.date.toISOString(), createdAt: transaction.createdAt.toISOString(), updatedAt: transaction.updatedAt.toISOString() };
  }
}

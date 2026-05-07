import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Category } from '@expense-tracker/shared-types';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateCategoryCommand } from '../update-category.command';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UpdateCategoryCommand): Promise<Category> {
    const existing = await this.prisma.category.findUnique({
      where: { id: command.id },
    });

    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    if (existing.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.category.update({
      where: { id: command.id },
      data: {
        ...(command.name !== undefined && { name: command.name }),
        ...(command.color !== undefined && { color: command.color }),
        ...(command.icon !== undefined && { icon: command.icon }),
      },
    });
  }
}

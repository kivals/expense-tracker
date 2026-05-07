import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DeleteCategoryCommand } from '../delete-category.command';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: DeleteCategoryCommand): Promise<void> {
    const existing = await this.prisma.category.findUnique({
      where: { id: command.id },
    });

    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    if (existing.userId !== command.userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.category.delete({ where: { id: command.id } });
  }
}

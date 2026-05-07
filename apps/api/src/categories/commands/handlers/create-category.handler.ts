import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import type { Category } from '@expense-tracker/shared-types';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategoryCommand } from '../create-category.command';
import { GetUserByIdQuery } from '../../../users/queries/get-user-by-id.query';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<Category> {
    const user = await this.queryBus.execute(
      new GetUserByIdQuery(command.userId),
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.category.create({
      data: {
        name: command.name,
        color: command.color,
        icon: command.icon,
        userId: command.userId,
      },
    });
  }
}

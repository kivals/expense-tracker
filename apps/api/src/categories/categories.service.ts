import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared-types';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryCommand } from './commands/create-category.command';
import { UpdateCategoryCommand } from './commands/update-category.command';
import { DeleteCategoryCommand } from './commands/delete-category.command';
import { GetCategoriesByUserQuery } from './queries/get-categories-by-user.query';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  create(dto: CreateCategoryDto, userId: string): Promise<Category> {
    return this.commandBus.execute(
      new CreateCategoryCommand(dto.name, dto.color, dto.icon, userId),
    );
  }

  findAll(userId: string): Promise<Category[]> {
    return this.queryBus.execute(new GetCategoriesByUserQuery(userId));
  }

  update(id: string, dto: UpdateCategoryDto, userId: string): Promise<Category> {
    return this.commandBus.execute(
      new UpdateCategoryCommand(id, userId, dto.name, dto.color, dto.icon),
    );
  }

  remove(id: string, userId: string): Promise<void> {
    return this.commandBus.execute(new DeleteCategoryCommand(id, userId));
  }
}

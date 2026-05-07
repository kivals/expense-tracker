import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CreateCategoryHandler } from './commands/handlers/create-category.handler';
import { UpdateCategoryHandler } from './commands/handlers/update-category.handler';
import { DeleteCategoryHandler } from './commands/handlers/delete-category.handler';
import { GetCategoriesByUserHandler } from './queries/handlers/get-categories-by-user.handler';
import { GetCategoryByIdHandler } from './queries/handlers/get-category-by-id.handler';

const CommandHandlers = [
  CreateCategoryHandler,
  UpdateCategoryHandler,
  DeleteCategoryHandler,
];

const QueryHandlers = [GetCategoriesByUserHandler, GetCategoryByIdHandler];

@Module({
  imports: [CqrsModule],
  providers: [CategoriesService, ...CommandHandlers, ...QueryHandlers],
  controllers: [CategoriesController],
})
export class CategoriesModule {}

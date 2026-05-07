import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared-types';
import { PrismaService } from '../../../prisma/prisma.service';
import { GetCategoryByIdQuery } from '../get-category-by-id.query';

@QueryHandler(GetCategoryByIdQuery)
export class GetCategoryByIdHandler
  implements IQueryHandler<GetCategoryByIdQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  execute(query: GetCategoryByIdQuery): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id: query.id } });
  }
}

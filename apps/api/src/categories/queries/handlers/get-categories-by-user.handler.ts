import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import type { Category } from '@expense-tracker/shared-types';
import { PrismaService } from '../../../prisma/prisma.service';
import { GetCategoriesByUserQuery } from '../get-categories-by-user.query';

@QueryHandler(GetCategoriesByUserQuery)
export class GetCategoriesByUserHandler
  implements IQueryHandler<GetCategoriesByUserQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  execute(query: GetCategoriesByUserQuery): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { userId: query.userId },
      orderBy: { createdAt: 'asc' },
    });
  }
}

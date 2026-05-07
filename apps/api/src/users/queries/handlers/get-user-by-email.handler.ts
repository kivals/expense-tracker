import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "../../../prisma/prisma.service";
import { GetUserByEmailQuery } from "../get-user-by-email.query";

type UserWithHash = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetUserByEmailQuery): Promise<UserWithHash | null> {
    return this.prisma.user.findUnique({
      where: { email: query.email },
      select: { id: true, name: true, email: true, passwordHash: true },
    });
  }
}

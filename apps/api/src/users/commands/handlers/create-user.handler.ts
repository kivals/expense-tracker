import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ConflictException } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { CreateUserCommand } from "../create-user.command";
import type { PublicUser } from "@expense-tracker/shared-types";

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: CreateUserCommand): Promise<PublicUser> {
    const { name, email, passwordHash } = command;
    try {
      const user = await this.prisma.user.create({
        data: { name, email, passwordHash },
        select: { id: true, name: true, email: true },
      });
      return user;
    } catch (err: any) {
      if (err?.code === "P2002") {
        throw new ConflictException("Email already in use");
      }
      throw err;
    }
  }
}

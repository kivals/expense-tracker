import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserCommand } from "../users/commands/create-user.command";
import { GetUserByEmailQuery } from "../users/queries/get-user-by-email.query";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import type { AuthResponse, PublicUser } from "@expense-tracker/shared-types";

@Injectable()
export class AuthService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.commandBus.execute<CreateUserCommand, PublicUser>(
      new CreateUserCommand(dto.name, dto.email, passwordHash),
    );
    return { accessToken: this.signToken(user), user };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.queryBus.execute<
      GetUserByEmailQuery,
      (PublicUser & { passwordHash: string }) | null
    >(new GetUserByEmailQuery(dto.email));

    const valid = user && (await bcrypt.compare(dto.password, user.passwordHash));
    if (!valid) throw new UnauthorizedException("Invalid credentials");

    const { passwordHash: _, ...publicUser } = user;
    return { accessToken: this.signToken(publicUser), user: publicUser };
  }

  private signToken(user: PublicUser): string {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}

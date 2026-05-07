import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { QueryBus } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../../users/queries/get-user-by-id.query";
import type { PublicUser } from "@expense-tracker/shared-types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly queryBus: QueryBus,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: { sub: string; email: string }): Promise<PublicUser> {
    const user = await this.queryBus.execute<GetUserByIdQuery, PublicUser | null>(
      new GetUserByIdQuery(payload.sub),
    );
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

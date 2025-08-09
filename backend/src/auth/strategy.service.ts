import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {type} from 'os'
import { ExtractJwt, Strategy } from "passport-jwt";

type Payload = {
    sub: string,
    email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly ConfigService: ConfigService,
        private readonly PrismaService: PrismaService
    ) {
        const secret = ConfigService.get<string>('JWT_SECRET') || 'fallback-secret'
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: secret,
          ignoreExpiration: false,
        });
      }

    async validate(payload: Payload){
        const user = await this.PrismaService.user.findUnique({where: { id: payload.sub },})
        if(!user) throw new UnauthorizedException("Unauthorized")
            Reflect.deleteProperty(user, 'password')
            console.log(user)
        return user
    }

}
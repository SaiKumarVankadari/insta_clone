import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-local";
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: any) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        console.log('Decoded JWT Payload:', payload);
        if (payload.exp && currentTimestamp > payload.exp) {
          throw new UnauthorizedException({
            message: 'Token has expired',
            error: 'Unauthorized',
          });
        }
        return payload;
    }
}
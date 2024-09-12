import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['PS512'],
      secretOrKeyProvider: (request: any, rawJwtToken: any, done: any) => {
        // console.log('request', request);
        // console.log('rawJwtToken', rawJwtToken);
        done(null, process.env.JWT_PUBLIC_KEY);
      }
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, permissions: payload.permissions, roles: payload.roles };
  }
}

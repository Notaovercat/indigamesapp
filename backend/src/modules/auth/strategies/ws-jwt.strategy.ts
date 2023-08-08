import { Payload } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../../user/services/user.service';
import { WsException } from '@nestjs/websockets';

const getAuthTokenFromCookie = (cookieString: string): string | null => {
  const cookiePairs = cookieString.split('; ');
  for (const cookiePair of cookiePairs) {
    const [name, value] = cookiePair.split('=');
    if (name === 'Authentication') {
      return value;
    }
  }
  return null;
};

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
  constructor(
    readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          const cookies = request.handshake.headers.cookie;
          if (!cookies) throw new WsException('Invalid credentials.');
          const token = getAuthTokenFromCookie(cookies);
          if (!token) throw new WsException('Invalid credentials.');
          return token;
        },
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  validate(payload: Payload) {
    return this.userService.findById(payload.id);
  }
}

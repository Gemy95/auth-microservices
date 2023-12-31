import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenClientStrategy extends PassportStrategy(
  Strategy,
  'RefreshTokenClientStrategy',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(
        configService.get<string>('REFRESH_TOKEN_CLIENT_PUBLIC_KEY'),
        'base64',
      ).toString('ascii'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, aud, iss, sub, ...data } = payload;
    return data; // strategy set req.user= payload by default if validated
  }
}

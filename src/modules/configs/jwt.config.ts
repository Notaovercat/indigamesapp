import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt.config',
  (): JwtModuleAsyncOptions => ({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: `${configService.get<number>('JWT_EXPIRES_IN')}s`,
      },
    }),
  }),
);

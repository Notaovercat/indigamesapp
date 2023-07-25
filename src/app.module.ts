import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.number().required(),
      }),
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PassportModule,
  ],
  providers: [ConfigService],
  controllers: [],
})
export class AppModule {}

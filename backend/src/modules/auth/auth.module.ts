import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import jwtConfig from '../configs/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';
import { WsJwtStrategy } from './strategies/ws-jwt.strategy';

@Module({
  imports: [JwtModule.registerAsync(jwtConfig()), UserModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, WsJwtStrategy],
})
export class AuthModule {}

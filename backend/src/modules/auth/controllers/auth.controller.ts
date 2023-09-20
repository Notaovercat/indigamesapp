import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, JwtGuard, LocalGuard, Public } from '@app/common';
import { CurrentUser, UserEntity } from '@app/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: CreateUserDto) {
    await this.authService.register(user);
    return 'Success';
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send('Success');
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('Authentication');
    response.send('Success');
  }

  @Public()
  @UseGuards(JwtGuard)
  @Get('check')
  @HttpCode(HttpStatus.OK)
  async check(@CurrentUser() user: UserEntity) {
    if (user) return user.id;
    else return null;
  }
}

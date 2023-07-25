import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto, LocalGuard } from '@app/common';
import { CurrentUser, UserEntity } from '@app/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }
}

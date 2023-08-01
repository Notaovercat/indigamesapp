import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, LocalGuard } from '@app/common';
import { CurrentUser, UserEntity } from '@app/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: CreateUserDto) {
    await this.authService.register(user);
    return 'Success';
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  async login(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send('Success');
  }
}

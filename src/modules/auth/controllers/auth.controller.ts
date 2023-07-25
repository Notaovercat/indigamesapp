import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalGuard } from '../guards/local.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UserEntity } from '../../user/entities/user.entity';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() user: RegisterDto) {
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

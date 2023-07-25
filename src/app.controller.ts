import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from './modules/auth/guards/jwt.guard';

@Controller('test')
export class AppController {
  @Get('na')
  testNoAuth() {
    console.log('succ');
  }

  @UseGuards(JwtGuard)
  @Get('a')
  testAuth() {
    console.log('succ');
  }
}

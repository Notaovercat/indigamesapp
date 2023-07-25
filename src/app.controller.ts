import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  JwtGuard,
  RoleGuard,
  UserEntity,
  Public,
  CurrentUser,
  Roles,
} from '@app/common';

@Controller('test')
export class AppController {
  @Get('na')
  testNoAuth() {
    return 'succ';
  }

  @UseGuards(JwtGuard)
  @Get('a')
  testAuth() {
    return 'succ';
  }

  @UseGuards(JwtGuard)
  @Public()
  @Get('ap')
  testAuthPublic() {
    return 'succ';
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Get('ap2')
  testAuthRoleAdmin(@CurrentUser() user: UserEntity) {
    return 'succ';
  }
}

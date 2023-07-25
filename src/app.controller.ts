import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { Public } from './modules/auth/decorators/public.decorator';
import { CurrentUser } from './modules/auth/decorators/current-user.decorator';
import { UserEntity } from './modules/user/entities/user.entity';
import { RoleGuard } from './modules/auth/guards/role.guard';
import { Roles } from './modules/auth/decorators/roles.decorator';

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

  @UseGuards(JwtGuard)
  @Public()
  @Get('ap')
  testAuthPublic() {
    console.log('succ');
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Get('ap2')
  testAuthRoleAdmin(@CurrentUser() user: UserEntity) {
    console.log();
  }
}

import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('users')
  @CacheTTL(3600000)
  @Get()
  getUsers() {
    return this.userService.findUsers();
  }
}

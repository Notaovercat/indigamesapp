import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { CurrentUser, JwtGuard, Public, UserEntity } from '@app/common';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get(':id')
  getUserProfile(@Param('id') userId: string) {
    return this.profileService.findUserProfile(userId);
  }

  @Get(':id/games')
  getUserGames(
    @Param('id') userId: string,
    @Query('isYourProfile') isYourProfile: boolean,
  ) {
    return this.profileService.findUserGames(userId, isYourProfile);
  }

  @Get(':id/teams')
  getUserTeams(
    @Param('id') userId: string,
    @Query('isYourProfile') isYourProfile: boolean,
  ) {
    return this.profileService.findUserTeams(userId, isYourProfile);
  }
}

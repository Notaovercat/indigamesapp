import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';

@Controller('profile')
export class ProfileController {
  private logger = new Logger(ProfileController.name);

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

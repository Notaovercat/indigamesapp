import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service';

@Controller('profile')
export class ProfileController {
  private logger = new Logger(ProfileController.name);

  constructor(private profileService: ProfileService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getUserProfile(@Param('id') userId: string) {
    return this.profileService.findUserProfile(userId);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/games')
  getUserGames(
    @Param('id') userId: string,
    @Query('isYourProfile') isYourProfile: boolean,
  ) {
    return this.profileService.findUserGames(userId, isYourProfile);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/teams')
  getUserTeams(
    @Param('id') userId: string,
    @Query('isYourProfile') isYourProfile: boolean,
  ) {
    return this.profileService.findUserTeams(userId, isYourProfile);
  }
}

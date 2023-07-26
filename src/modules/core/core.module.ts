import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { PlatformsModule } from './platforms/platforms.module';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [GamesModule, PlatformsModule, TeamsModule],
})
export class CoreModule {}

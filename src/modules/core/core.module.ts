import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { PlatformsModule } from './platforms/platforms.module';
import { TeamsModule } from './teams/teams.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [GamesModule, PlatformsModule, TeamsModule, TagsModule],
})
export class CoreModule {}

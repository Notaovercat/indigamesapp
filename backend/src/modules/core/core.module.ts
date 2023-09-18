import { Module } from '@nestjs/common';
import { GamesModule } from './games/games.module';
import { PlatformsModule } from './platforms/platforms.module';
import { TeamsModule } from './teams/teams.module';
import { TagsModule } from './tags/tags.module';
import { GenresModule } from './genres/genres.module';
import { ProfileModule } from './profile/profile.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    GamesModule,
    PlatformsModule,
    TeamsModule,
    TagsModule,
    GenresModule,
    ProfileModule,
    CommentsModule,
  ],
})
export class CoreModule {}

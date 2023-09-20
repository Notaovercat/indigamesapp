import { Module } from '@nestjs/common';
import { GamesController } from './controllers/games.controller';
import { GamesService } from './services/games.service';
import { TeamsModule } from '../teams/teams.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesModule } from '../images/images.module';
import { CacheService } from './utils/cache-pattern';

@Module({
  imports: [TeamsModule, ImagesModule, MulterModule.register()],
  controllers: [GamesController],
  providers: [GamesService, CacheService],
})
export class GamesModule {}

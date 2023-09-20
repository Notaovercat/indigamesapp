import { Module } from '@nestjs/common';
import { GamesController } from './controllers/games.controller';
import { GamesService } from './services/games.service';
import { TeamsModule } from '../teams/teams.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImagesModule } from '../images/images.module';
import { CacheModule } from '../../cache/cache.module';

@Module({
  imports: [CacheModule, TeamsModule, ImagesModule, MulterModule.register()],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}

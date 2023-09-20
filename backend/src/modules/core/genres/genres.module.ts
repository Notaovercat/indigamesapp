import { Module } from '@nestjs/common';
import { GenresController } from './controllers/genres.controller';
import { GenresService } from './services/genres.service';
import { CacheModule } from '../../cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}

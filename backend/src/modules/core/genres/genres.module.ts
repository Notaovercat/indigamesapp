import { Module } from '@nestjs/common';
import { GenresController } from './controllers/genres.controller';
import { GenresService } from './services/genres.service';

@Module({
  controllers: [GenresController],
  providers: [GenresService],
})
export class GenresModule {}

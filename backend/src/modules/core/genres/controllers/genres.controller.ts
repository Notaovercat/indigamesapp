import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GenresService } from '../services/genres.service';
import { CreateGenreDto, JwtGuard, RoleGuard, Roles } from '@app/common';

@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Get()
  getAllGenres() {
    return this.genresService.findAllGenres();
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Post()
  createPlatform(@Body() dto: CreateGenreDto) {
    return this.genresService.createGenre(dto);
  }
}

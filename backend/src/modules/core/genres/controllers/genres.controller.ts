import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GenresService } from '../services/genres.service';
import {
  CreateGenreDto,
  JwtGuard,
  RoleGuard,
  Roles,
  UpdateGenreDto,
} from '@app/common';

@Controller('genres')
export class GenresController {
  constructor(private genresService: GenresService) {}

  @Get()
  getAllGenres() {
    return this.genresService.findAllGenres();
  }

  @Get(':id')
  getGenreById(@Param('id') genreId: string) {
    return this.genresService.findOneGenre(genreId);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Post()
  createPlatform(@Body() dto: CreateGenreDto) {
    return this.genresService.createGenre(dto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  updatePlatform(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.updaetGenre(id, dto);
  }
}

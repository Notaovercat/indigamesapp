import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GenresService } from '../services/genres.service';
import {
  CreateGenreDto,
  JwtGuard,
  RoleGuard,
  Roles,
  UpdateGenreDto,
} from '@app/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('genres')
export class GenresController {
  private logger: Logger = new Logger(GenresController.name);

  constructor(private genresService: GenresService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('genres')
  @CacheTTL(3600000)
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
  async createPlatform(@Body() dto: CreateGenreDto) {
    return this.genresService.createGenre(dto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updatePlatform(@Param('id') id: string, @Body() dto: UpdateGenreDto) {
    return this.genresService.updaetGenre(id, dto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deletePlatform(@Param('id') id: string) {
    return this.genresService.deleteGenre(id);
  }
}

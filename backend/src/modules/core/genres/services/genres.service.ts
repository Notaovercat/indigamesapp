import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGenreDto, UpdateGenreDto } from '@app/common';
import { IGenre } from '@workspace/shared';
import { CacheService } from '../../../cache/services/cache.service';

@Injectable()
export class GenresService {
  private logger: Logger = new Logger(GenresService.name);

  constructor(
    private cacheService: CacheService,
    private prisma: PrismaService,
  ) {}

  findAllGenres(): Promise<IGenre[]> {
    return this.prisma.genre.findMany();
  }

  findOneGenre(genreId: string): Promise<IGenre> {
    return this.prisma.genre.findFirstOrThrow({
      where: {
        id: genreId,
      },
    });
  }

  async createGenre(dto: CreateGenreDto): Promise<IGenre> {
    // clear cache
    await this.cacheService.deleteCache('genres');

    return this.prisma.genre.create({ data: { ...dto } });
  }

  async updateGenre(genreId: string, dto: UpdateGenreDto): Promise<IGenre> {
    // clear cache
    await this.cacheService.deleteCache('genres');

    return this.prisma.genre.update({
      where: { id: genreId },
      data: { ...dto },
    });
  }

  async deleteGenre(genreId: string): Promise<IGenre> {
    // clear cache
    await this.cacheService.deleteCache('genres');

    return this.prisma.genre.delete({
      where: {
        id: genreId,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGenreDto, UpdateGenreDto } from '@app/common';
import { IGenre } from '@workspace/shared';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

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

  createGenre(dto: CreateGenreDto) {
    return this.prisma.genre.create({ data: { ...dto } });
  }

  updaetGenre(genre: string, dto: UpdateGenreDto) {
    return this.prisma.genre.update({
      where: { id: genre },
      data: { ...dto },
    });
  }
}

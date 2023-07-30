import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGenreDto } from '@app/common';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  findAllGenres() {
    return this.prisma.genre.findMany();
  }

  createGenre(dto: CreateGenreDto) {
    return this.prisma.genre.create({ data: { ...dto } });
  }
}

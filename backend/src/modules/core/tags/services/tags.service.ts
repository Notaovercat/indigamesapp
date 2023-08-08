import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  // createTag;
  findAllTags() {
    return this.prisma.tag.findMany();
  }
}

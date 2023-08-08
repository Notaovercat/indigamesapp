import { Injectable } from '@nestjs/common';
import { CreatePlatformDto, UpdatePlatformDto } from '@app/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PlatformsService {
  constructor(private prisma: PrismaService) {}

  findAllPlatforms() {
    return this.prisma.platform.findMany();
  }

  findPlatformById(id: string) {
    return this.prisma.platform.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  createPlatform(platformDto: CreatePlatformDto) {
    return this.prisma.platform.create({
      data: {
        ...platformDto,
      },
    });
  }

  async updatePlatform(platformId: string, dto: UpdatePlatformDto) {
    const platform = await this.findPlatformById(platformId);
    return this.prisma.platform.update({
      where: {
        id: platform.id,
      },
      data: {
        ...dto,
      },
    });
  }
}

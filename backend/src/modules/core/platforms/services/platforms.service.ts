import { Injectable } from '@nestjs/common';
import { CreatePlatformDto, UpdatePlatformDto } from '@app/common';
import { PrismaService } from 'nestjs-prisma';
import { IPlatform } from '@workspace/shared';

@Injectable()
export class PlatformsService {
  constructor(private prisma: PrismaService) {}

  findAllPlatforms(): Promise<IPlatform[]> {
    return this.prisma.platform.findMany();
  }

  findPlatformById(id: string): Promise<IPlatform> {
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
    return this.prisma.platform.update({
      where: {
        id: platformId,
      },
      data: {
        ...dto,
      },
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { CreatePlatformDto, UpdatePlatformDto } from '@app/common';
import { PrismaService } from 'nestjs-prisma';
import { IPlatform } from '@workspace/shared';
import { CacheService } from '../../../cache/services/cache.service';

@Injectable()
export class PlatformsService {
  private logger: Logger = new Logger(PlatformsService.name);

  constructor(
    private cacheService: CacheService,
    private prisma: PrismaService,
  ) {}

  findAllPlatforms(): Promise<IPlatform[]> {
    return this.prisma.platform.findMany();
  }

  findPlatformById(id: string): Promise<IPlatform> {
    return this.prisma.platform.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async createPlatform(platformDto: CreatePlatformDto) {
    await this.cacheService.deleteCache('platforms');

    return this.prisma.platform.create({
      data: {
        ...platformDto,
      },
    });
  }

  async updatePlatform(platformId: string, dto: UpdatePlatformDto) {
    await this.cacheService.deleteCache('platforms');
    return this.prisma.platform.update({
      where: {
        id: platformId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletePlatform(platformId: string) {
    await this.cacheService.deleteCache('platforms');
    return this.prisma.platform.delete({
      where: {
        id: platformId,
      },
    });
  }
}

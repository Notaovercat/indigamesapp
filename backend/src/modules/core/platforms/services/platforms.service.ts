import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePlatformDto, UpdatePlatformDto } from '@app/common';
import { PrismaService } from 'nestjs-prisma';
import { IPlatform } from '@workspace/shared';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class PlatformsService {
  private logger: Logger = new Logger(PlatformsService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private prisma: PrismaService,
  ) {}

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

  async createPlatform(platformDto: CreatePlatformDto) {
    await this.cacheManager.del('platforms');

    return this.prisma.platform.create({
      data: {
        ...platformDto,
      },
    });
  }

  async updatePlatform(platformId: string, dto: UpdatePlatformDto) {
    await this.cacheManager.del('platforms');
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
    await this.cacheManager.del('platforms');
    return this.prisma.platform.delete({
      where: {
        id: platformId,
      },
    });
  }
}

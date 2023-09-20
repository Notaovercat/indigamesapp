import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Logger,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { PlatformsService } from '../services/platforms.service';
import {
  CreatePlatformDto,
  JwtGuard,
  RoleGuard,
  Roles,
  UpdatePlatformDto,
} from '@app/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller('platforms')
export class PlatformsController {
  private logger: Logger = new Logger(PlatformsController.name);

  constructor(private readonly platformsService: PlatformsService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey('platforms')
  @CacheTTL(3600000)
  @Get()
  async getAllPlatforms() {
    return this.platformsService.findAllPlatforms();
  }

  @Get(':id')
  getPlatform(@Param('id') id: string) {
    return this.platformsService.findPlatformById(id);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Post()
  async createPlatform(@Body() dto: CreatePlatformDto) {
    return this.platformsService.createPlatform(dto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  async updatePlatform(
    @Param('id') id: string,
    @Body() dto: UpdatePlatformDto,
  ) {
    return this.platformsService.updatePlatform(id, dto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deletePlatform(@Param('id') id: string) {
    return this.platformsService.deletePlatform(id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PlatformsService } from '../services/platforms.service';
import {
  CreatePlatformDto,
  JwtGuard,
  RoleGuard,
  Roles,
  UpdatePlatformDto,
} from '@app/common';

@Controller('platforms')
export class PlatformsController {
  constructor(private readonly platformsService: PlatformsService) {}

  @Get()
  getAllPlatforms() {
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
  createPlatform(@Body() dto: CreatePlatformDto) {
    return this.platformsService.createPlatform(dto);
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Patch(':id')
  updatePlatform(@Param('id') id: string, @Body() dto: UpdatePlatformDto) {
    return this.platformsService.updatePlatform(id, dto);
  }
}

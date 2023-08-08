import { Module } from '@nestjs/common';
import { PlatformsService } from './services/platforms.service';
import { PlatformsController } from './controllers/platforms.controller';

@Module({
  controllers: [PlatformsController],
  providers: [PlatformsService],
})
export class PlatformsModule {}

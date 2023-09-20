import { Module } from '@nestjs/common';
import { PlatformsService } from './services/platforms.service';
import { PlatformsController } from './controllers/platforms.controller';
import { CacheModule } from '../../cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [PlatformsController],
  providers: [PlatformsService],
})
export class PlatformsModule {}

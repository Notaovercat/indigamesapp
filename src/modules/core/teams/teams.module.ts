import { Module } from '@nestjs/common';
import { TeamsService } from './services/teams.service';

@Module({
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}

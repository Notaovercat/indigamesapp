import { Module } from '@nestjs/common';
import { TeamsService } from './services/teams.service';
import { TeamController } from './controllers/teams.controller';

@Module({
  controllers: [TeamController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}

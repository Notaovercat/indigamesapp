import { Module } from '@nestjs/common';
import { TeamsService } from './services/teams.service';
import { TeamController } from './controllers/teams.controller';
import { UserService } from '../../user/services/user.service';

@Module({
  controllers: [TeamController],
  providers: [TeamsService, UserService],
  exports: [TeamsService],
})
export class TeamsModule {}

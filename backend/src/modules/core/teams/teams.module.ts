import { Module } from '@nestjs/common';
import { TeamsService } from './services/teams.service';
import { TeamController } from './controllers/teams.controller';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TeamController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}

import { Module } from '@nestjs/common';
import { TeamsService } from './services/teams.service';
import { TeamController } from './controllers/teams.controller';
import { UserService } from '../../user/services/user.service';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TeamController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}

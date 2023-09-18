import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import { CommentsGateway } from './gateways/comments.gateway';

@Module({
  providers: [CommentsService, CommentsGateway],
})
export class CommentsModule {}

import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  BaseWsExceptionFilter,
  WsException,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import {
  CreateCommentDto,
  CurrentUser,
  UserEntity,
  WsJwtGuard,
} from '@app/common';
import { CommentsService } from '../services/comments.service';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  logger = new Logger(CommentsGateway.name);

  @WebSocketServer() server: Server = new Server();

  constructor(private commentsService: CommentsService) {}

  handleConnection(client: Socket) {
    client.on('room', (gameId: string) => {
      client.join(gameId);
      this.logger.log(`Client ${client.id} joined room ${gameId}`);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Socket disconnected`);
    client.disconnect();
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('newComment')
  createComment(
    @MessageBody() dto: CreateCommentDto,
    @CurrentUser() user: UserEntity,
  ) {
    this.logger.debug(dto, user);
  }

  @SubscribeMessage('getAllComments')
  async gatComments(@MessageBody() dto: { gameId: string }) {
    const { gameId } = dto;
    const comments = await this.commentsService.getGameComments(gameId);
    this.logger.debug(`Load comments from ${gameId} `);

    this.server.to(gameId).emit('comments', comments);
  }
}

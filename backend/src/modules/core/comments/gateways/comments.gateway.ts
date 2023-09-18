import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import {
  CreateCommentDto,
  CurrentUser,
  UpdateCommentDto,
  UserEntity,
  WsJwtGuard,
} from '@app/common';
import { CommentsService } from '../services/comments.service';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_API || 'http:localhost:3000',
    credentials: true,
  },
  namespace: 'comments',
})
export class CommentsGateway implements OnGatewayDisconnect {
  logger = new Logger(CommentsGateway.name);

  @WebSocketServer() server: Server;

  constructor(private commentsService: CommentsService) {}

  handleDisconnect(client: Socket) {
    // this.logger.log(`${client.id} disconnected`);
    client.disconnect();
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() gameId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(gameId);
    // this.logger.debug(`Client ${client.id} joined gameId ${gameId}`);
    const comments = await this.commentsService.getGameComments(gameId);
    this.server.to(gameId).emit('getComments', comments);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendComment')
  async sendComment(
    @MessageBody()
    dto: CreateCommentDto,
    @CurrentUser() user: UserEntity,
  ) {
    const comment = await this.commentsService.createComment(dto, user.id);
    this.server.to(dto.gameId).emit('newComment', comment);
    // this.logger.debug(
    //   `Game: ${dto.gameId}, recieved comment from ${user.username} - ${dto.content}`,
    // );
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('updateComment')
  async updateComment(@MessageBody() dto: UpdateCommentDto) {
    const updatedComment = await this.commentsService.updateComment(dto);
    this.server
      .to(updatedComment.gameId)
      .emit('commentUpdated', updatedComment);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('deleteComment')
  async deleteComment(@MessageBody('commentId') id: string) {
    const deletedComment = await this.commentsService.deleteComment(id);
    this.server.to(deletedComment.gameId).emit('commentDeleted', id);
  }
}

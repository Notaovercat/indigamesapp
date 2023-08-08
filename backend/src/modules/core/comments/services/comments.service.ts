import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCommentDto } from '@app/common';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  createComment(dto: CreateCommentDto, userId: string) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        game: {
          connect: {
            id: dto.sourceId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  getGameComments(gameId: string) {
    return this.prisma.comment.findMany({
      where: {
        gameId,
      },
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCommentDto, UpdateCommentDto } from '@app/common';
import { IComment } from '@workspace/shared';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  logger = new Logger(CommentsService.name);

  createComment(dto: CreateCommentDto, userId: string): Promise<IComment> {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        game: {
          connect: {
            id: dto.gameId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        content: true,
        gameId: true,
        isDeleted: true,
        isRedacted: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  getGameComments(gameId: string): Promise<IComment[]> {
    return this.prisma.comment.findMany({
      where: {
        gameId,
      },
      select: {
        id: true,
        content: true,
        gameId: true,
        isDeleted: true,
        isRedacted: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateComment(dto: UpdateCommentDto): Promise<IComment> {
    return this.prisma.comment.update({
      where: {
        id: dto.commentId,
      },
      data: {
        content: dto.content,
        isRedacted: true,
      },
      select: {
        id: true,
        content: true,
        gameId: true,
        isDeleted: true,
        isRedacted: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async deleteComment(commentId: string) {
    return this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
}

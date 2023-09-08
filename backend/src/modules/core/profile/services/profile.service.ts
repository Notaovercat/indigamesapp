import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  findUserProfile(userId: string) {
    return this.prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        username: true,
        description: true,
        createdAt: true,
      },
    });
  }

  findUserGames(userId: string, isYourProfile = false) {
    return this.prisma.game.findMany({
      where: {
        team: {
          authorId: userId,
        },
        isVisible: isYourProfile ? undefined : true,
      },

      select: {
        id: true,
        title: true,
        description: true,
        coverImage: {
          select: {
            id: true,
            name: true,
          },
        },
        views_count: true,
        rating: true,
        createdAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  findUserTeams(userId: string, isYourProfile = false) {
    return this.prisma.teamMember.findMany({
      where: {
        userId,
        team: {
          game: {
            isVisible: isYourProfile ? undefined : true,
          },
        },
      },
      select: {
        id: true,
        role: true,
        team: {
          select: {
            id: true,
            author: {
              select: {
                id: true,
                username: true,
              },
            },
            game: {
              select: {
                id: true,
                title: true,
                coverImage: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
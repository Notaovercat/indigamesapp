import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ImagesService {
  constructor(private prisma: PrismaService) {}

  async createCoverImage(filename: string, gameId: string) {
    const image = await this.prisma.coverImage.findFirst({
      where: {
        game: {
          id: gameId,
        },
      },
    });

    if (image)
      await this.prisma.coverImage.delete({
        where: {
          id: image.id,
        },
      });

    return this.prisma.coverImage.create({
      data: {
        name: filename,
        game: {
          connect: {
            id: gameId,
          },
        },
      },
    });
  }

  async createScreenshot(filename: string, gameId: string) {
    return this.prisma.screenshot.create({
      data: {
        name: filename,
        game: {
          connect: {
            id: gameId,
          },
        },
      },
    });
  }

  async deleteCover(coverId: string) {
    return this.prisma.coverImage.delete({
      where: {
        id: coverId,
      },
    });
  }

  async deleteScreenshot(screenId: string) {
    return this.prisma.screenshot.delete({
      where: {
        id: screenId,
      },
    });
  }
}

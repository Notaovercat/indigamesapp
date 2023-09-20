import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { PrismaService } from 'nestjs-prisma';
import { join } from 'path';

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

    if (image) {
      await Promise.all([
        await this.prisma.coverImage.delete({
          where: {
            id: image.id,
          },
        }),
        await this.deleteFile(image.name),
      ]);
    }

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
    const deletedCover = await this.prisma.coverImage.delete({
      where: {
        id: coverId,
      },
    });

    // deleting from folder
    await this.deleteFile(deletedCover.name);
    return deletedCover;
  }

  async deleteScreenshot(screenId: string) {
    const deletedScreen = await this.prisma.screenshot.delete({
      where: {
        id: screenId,
      },
    });

    await this.deleteFile(deletedScreen.name);

    return deletedScreen;
  }

  async deleteFile(name: string) {
    const imagePath = join(__dirname, '../uploads/images', name);
    await unlink(imagePath);
  }
}

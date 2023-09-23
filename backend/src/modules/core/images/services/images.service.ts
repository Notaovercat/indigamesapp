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
      await this.deleteFile(image.name);
      return this.prisma.coverImage.update({
        where: {
          id: image.id,
        },
        data: {
          name: filename,
        },
      });
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
    // const imagePath = join(__dirname, '../uploads/images', name);
    const imagePath = join(process.cwd(), '/uploads/images', name);
    await unlink(imagePath);
  }
}

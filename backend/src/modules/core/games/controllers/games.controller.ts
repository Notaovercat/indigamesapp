import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CurrentUser,
  JwtGuard,
  UserEntity,
  CreateGameDto,
  UpdateGameDto,
  ChangeVisibilityDto,
  Public,
  RemovePlatformDto,
  RemoveTagDto,
} from '@app/common';
import { GamesService } from '../services/games.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';

const storageOptions = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString().replace(/\//g, '-');
      const timeStr = now
        .toLocaleTimeString()
        .replace(/:/g, '-')
        .replace(/\s/g, '');
      const originalFilename = file.originalname.replace(/\s/g, '_');
      const filename = `${dateStr}_${timeStr}_${originalFilename}`;
      cb(null, filename);
    },
  }),
};

@Controller('games')
export class GamesController {
  private readonly logger = new Logger(GamesService.name);

  constructor(private gamesService: GamesService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  createGame(@Body() dto: CreateGameDto, @CurrentUser() user: UserEntity) {
    return this.gamesService.createGame(dto, user);
  }

  @Get()
  getAllGames(
    @Query('isFeatured') isFeatured: boolean,
    @Query('lastUpdated') lastUpdated: boolean,
  ) {
    return this.gamesService.findAllGames(isFeatured, lastUpdated);
  }

  @UseGuards(JwtGuard)
  @Get('my')
  getMyGames(@CurrentUser() user: UserEntity) {
    return this.gamesService.findMyGames(user.id);
  }

  @UseGuards(JwtGuard)
  @Post('visible')
  changeVisibility(
    @Body() dto: ChangeVisibilityDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.changeVisibility(dto, user.id);
  }

  @UseGuards(JwtGuard)
  @Public()
  @Get(':id')
  getGameById(@Param('id') gameId: string, @CurrentUser() user?: UserEntity) {
    return this.gamesService.findGameById(gameId, user?.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateGame(
    @Body() dto: UpdateGameDto,
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.updateGame(id, dto, user.id);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('cover', storageOptions))
  @Patch(':id/cover')
  uploadCover(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.gamesService.uploadCover(id, user.id, file);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('screenshot', storageOptions))
  @Patch(':id/screenshot')
  uploadScreenshot(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.gamesService.uploadScreenshot(id, user.id, file);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/cover')
  deleteCover(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body('imageId') imageId: string,
  ) {
    return this.gamesService.deleteCover(id, user.id, imageId);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/screenshot')
  deleteScreenshot(
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
    @Body('imageId') imageId: string,
  ) {
    return this.gamesService.deleteScreenshot(id, user.id, imageId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/rmplatform')
  removePlatform(
    @Param('id') gameId: string,
    @Body() dto: RemovePlatformDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.removePlatformFromGame(gameId, dto, user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/rmtag')
  removeTag(
    @Param('id') gameId: string,
    @Body() dto: RemoveTagDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.removeTagFromGame(gameId, dto, user.id);
  }
}
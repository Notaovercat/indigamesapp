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
  GameQueryDto,
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
  private readonly logger = new Logger(GamesController.name);

  constructor(private gamesService: GamesService) {}

  @UseGuards(JwtGuard)
  @Post()
  createGame(@Body() dto: CreateGameDto, @CurrentUser() user: UserEntity) {
    return this.gamesService.createGame(dto, user);
  }

  @Get()
  getAllGames(@Query() query: GameQueryDto) {
    return this.gamesService.findAllGames(query);
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

  @Public()
  @UseGuards(JwtGuard)
  @Get(':id')
  getGameById(
    @Param('id') gameId: string,
    @Query('isManage') isManage: boolean,
    @CurrentUser() user?: UserEntity,
  ) {
    // this.logger.debug(user);
    return this.gamesService.findGameById(gameId, user?.id, isManage);
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
  @Patch(':id/rating')
  rateGame(
    @Param('id') gameId: string,
    @CurrentUser() user: UserEntity,
    @Body('rating') rating: number,
  ) {
    return this.gamesService.rateGame(gameId, user.id, rating);
  }

  @UseGuards(JwtGuard)
  @Delete(':gameId/screenshot/:screenId')
  deleteScreenshot(
    @Param('gameId') gameId: string,
    @Param('screenId') screenId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.deleteScreenshot(gameId, user.id, screenId);
  }

  @UseGuards(JwtGuard)
  @Patch(':gameId/rmplatform/:platformId')
  removePlatform(
    @Param('gameId') gameId: string,
    @Param('platformId') platformId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.removePlatformFromGame(
      gameId,
      platformId,
      user.id,
    );
  }

  @UseGuards(JwtGuard)
  @Patch(':gameId/rmtag/:tagId')
  removeTag(
    @Param('gameId') gameId: string,
    @Param('tagId') tagId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.removeTagFromGame(gameId, tagId, user.id);
  }
}

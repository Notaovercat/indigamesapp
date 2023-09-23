import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { storageOptions } from '../utils/multer';

@Controller('games')
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(private gamesService: GamesService) {}

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  createGame(@Body() dto: CreateGameDto, @CurrentUser() user: UserEntity) {
    return this.gamesService.createGame(dto, user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  getAllGames(@Query() query: GameQueryDto) {
    return this.gamesService.findAllGames(query);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('my')
  getMyGames(@CurrentUser() user: UserEntity) {
    return this.gamesService.findMyGames(user.id);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('my/:id')
  getMyGameById(@CurrentUser() user: UserEntity, @Param('id') id: string) {
    return this.gamesService.findMyGameById(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('visible')
  @HttpCode(HttpStatus.OK)
  changeVisibility(
    @Body() dto: ChangeVisibilityDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.changeVisibility(dto, user.id);
  }

  @Public()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getGameById(@Param('id') gameId: string, @CurrentUser() user?: UserEntity) {
    return this.gamesService.findGameById(gameId, user?.id);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @Patch(':id/rating')
  async rateGame(
    @Param('id') gameId: string,
    @CurrentUser() user: UserEntity,
    @Body('rating') rating: number,
  ) {
    return this.gamesService.rateGame(gameId, user.id, rating);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':gameId/screenshot/:screenId')
  deleteScreenshot(
    @Param('gameId') gameId: string,
    @Param('screenId') screenId: string,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.deleteScreenshot(gameId, user.id, screenId);
  }
}

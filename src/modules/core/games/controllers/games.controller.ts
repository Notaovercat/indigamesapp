import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CurrentUser,
  JwtGuard,
  UserEntity,
  CreateGameDto,
  Roles,
  RoleGuard,
  UpdateGameDto,
  ChangeVisibilityDto,
  Public,
  DisconnectPlatformDto,
} from '@app/common';
import { GamesService } from '../services/games.service';

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
    @Param('id') id: string,
    @Body() dto: UpdateGameDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.updateGame(id, dto, user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/rmplatform')
  removePlatform(
    @Param('id') gameId: string,
    @Body() dto: DisconnectPlatformDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.removePlatformFromGame(gameId, dto, user.id);
  }
}

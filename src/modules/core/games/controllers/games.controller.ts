import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseBoolPipe,
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
} from '@app/common';
import { GamesService } from '../services/games.service';

@Controller('games')
export class GamesController {
  private readonly logger = new Logger(GamesService.name);

  constructor(private gamesService: GamesService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  createGame(@Body() gameDto: CreateGameDto, @CurrentUser() user: UserEntity) {
    return this.gamesService.createGame(gameDto, user);
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
    @Body() visiblyDto: ChangeVisibilityDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.gamesService.changeVisibility(visiblyDto, user.id);
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
    @Body() updateGameDto: UpdateGameDto,
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
  ) {
    return this.gamesService.updateGame(id, updateGameDto, user);
  }
}

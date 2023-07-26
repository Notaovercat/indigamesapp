import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, JwtGuard, UserEntity } from '@app/common';
import { CreateGameDto } from '../dtos/create-game.dto';
import { GamesService } from '../services/games.service';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @UseGuards(JwtGuard)
  @Post('create')
  createGame(@Body() gameDto: CreateGameDto, @CurrentUser() user: UserEntity) {
    return this.gamesService.createGame(gameDto, user);
  }

  @Get()
  getAllGames() {
    return this.gamesService.findAllGames();
  }

  @Get(':id')
  getGameById(@Param('id') id: string) {
    return this.gamesService.findGameById(id);
  }
}

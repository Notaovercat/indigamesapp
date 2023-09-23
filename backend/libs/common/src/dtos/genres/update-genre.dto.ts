import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from '../games';
import { CreateGenreDto } from './create-genre.dto';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from '../games';

export class UpdateGenreDto extends PartialType(CreateGameDto) {}

import { Genre } from '@prisma/client';

export class GenreEntity implements Genre {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

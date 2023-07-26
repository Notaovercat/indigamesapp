import { Team } from '@prisma/client';

export class TeamEntity implements Team {
  id: string;
  authorId: string;
  gameId: string;
  createdAt: Date;
  updatedAt: Date;
}

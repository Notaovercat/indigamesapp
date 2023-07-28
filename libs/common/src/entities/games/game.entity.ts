import { Game, STATUS } from '@prisma/client';

export class GameEntity implements Game {
  id: string;
  title: string;
  description: string;
  status: STATUS;
  rating: number;
  views_count: number;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

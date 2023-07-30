import { Tag } from '@prisma/client';

export class TagEntity implements Tag {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

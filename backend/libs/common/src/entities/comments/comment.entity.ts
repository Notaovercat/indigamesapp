import { Comment } from '@prisma/client';

export class CommentEntity implements Comment {
  id: string;
  content: string;
  isRedacted: boolean;
  isDeleted: boolean;
  gameId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

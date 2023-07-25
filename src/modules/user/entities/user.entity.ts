import { ROLE, User } from '@prisma/client';

export class UserEntity implements User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: ROLE;
  createdAt: Date;
  updatedAt: Date;
}

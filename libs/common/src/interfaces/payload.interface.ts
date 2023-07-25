import { ROLE } from '@prisma/client';

export interface Payload {
  id: string;
  email: string;
  role: ROLE;
}

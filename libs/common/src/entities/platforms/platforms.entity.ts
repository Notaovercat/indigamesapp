import { Platform } from '@prisma/client';

export class PlatformEntity implements Platform {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

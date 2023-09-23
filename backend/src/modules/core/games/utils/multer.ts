import { diskStorage } from 'multer';
import { Request } from 'express';

export const storageOptions = {
  storage: diskStorage({
    destination: `${process.cwd()}/uploads/images`,
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString().replace(/\//g, '-');
      const timeStr = now
        .toLocaleTimeString()
        .replace(/:/g, '-')
        .replace(/\s/g, '');
      const originalFilename = file.originalname.replace(/\s/g, '_');
      const filename = `${dateStr}_${timeStr}_${originalFilename}`;
      cb(null, filename);
    },
  }),
};

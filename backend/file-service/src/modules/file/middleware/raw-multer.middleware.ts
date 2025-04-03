// src/files/middleware/raw-multer.middleware.ts
import * as multer from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const rawMulter = multer({
  storage: multer.diskStorage({
    destination: './temp',
    filename: (req: Request, file, cb) => {
      // Важно! Получаем путь как webkitRelativePath
      const originalPath = file.originalname;
      (file as any).relativePath = originalPath;

      const ext = path.extname(originalPath);
      cb(null, `${uuidv4()}${ext}`);
    },
  }),
});

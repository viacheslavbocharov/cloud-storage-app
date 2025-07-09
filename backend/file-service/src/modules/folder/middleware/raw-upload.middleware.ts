import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
const Busboy = require('busboy');
import { Request, Response, NextFunction } from 'express';

export function rawUploadMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const busboy = Busboy({ headers: req.headers });

  const files: Express.Multer.File[] = [];
  const body: Record<string, any> = {};

  busboy.on('file', (fieldname, file, info) => {
    const raw = info.filename;
    const filename =
      typeof raw === 'string'
        ? raw
        : typeof raw?.path === 'string'
          ? raw.path
          : '';

    if (!filename) return;

    const relativePath = filename;
    const uuid = uuidv4();
    const ext = path.extname(relativePath);
    const storedName = `${uuid}${ext}`;

    const tempDir = './temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempPath = path.join(tempDir, storedName);
    const stream = fs.createWriteStream(tempPath);
    file.pipe(stream);

    const sizeObj = { size: 0 };
    file.on('data', (data) => (sizeObj.size += data.length));

    file.on('end', () => {
      files.push({
        fieldname,
        originalname: path.basename(relativePath),
        mimetype: info.mimeType,
        filename: storedName,
        path: tempPath,
        size: sizeObj.size,
        destination: './temp',
        relativePath,
      } as any);
    });
  });

  busboy.on('field', (key, val) => {
    body[key] = val;
  });

  busboy.on('finish', () => {
    // Привязываем путь к каждому файлу
    const orderedPaths = Object.keys(body)
      .filter((k) => k.startsWith('paths['))
      .sort() // paths[0], paths[1], ...
      .map((k) => body[k]);

    for (let i = 0; i < files.length; i++) {
      (files[i] as any).relativePath = orderedPaths[i] ?? files[i].originalname;
    }

    req.body = body;
    req.files = files;
    next();
  });

  req.pipe(busboy);
}

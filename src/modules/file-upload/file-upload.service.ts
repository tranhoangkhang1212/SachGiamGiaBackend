import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Minio from 'minio';
import { extname } from 'path';
import { generateFileUrl } from 'src/utils/common-util';
import * as stream from 'stream';

@Injectable()
export class FileUploadService {
  private readonly minioClient: Minio.Client;
  config = this.getConfig();

  constructor() {
    this.minioClient = new Minio.Client(this.config);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    let fileStream = null;
    if (file.path) {
      fileStream = fs.createReadStream(file.path);
    } else if (file.buffer) {
      fileStream = stream.Readable.from(file.buffer);
    } else {
      throw new Error('Uploaded file is missing content');
    }

    const bucketName = this.config.bucketName;
    const fileInfoGenerated = generateFileUrl(file.originalname);
    await this.minioClient.putObject(bucketName, fileInfoGenerated.fileName, fileStream, file.size);
    return fileInfoGenerated.url;
  }

  getConfig() {
    return {
      bucketName: process.env.MINIO_BUCKET_NAME,
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    };
  }
}

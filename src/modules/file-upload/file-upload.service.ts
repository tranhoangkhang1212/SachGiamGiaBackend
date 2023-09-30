import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as Minio from 'minio';
import { extname } from 'path';
import { generateFileUrl } from 'src/utils/common-util';
import * as stream from 'stream';
import { UploadFileDto } from './dto/upload-file.dto';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';

@Injectable()
export class FileUploadService {
  private readonly minioClient: Minio.Client;
  constructor() {
    this.minioClient = new Minio.Client(this.getConfig());
  }

  async uploadFile(file: Express.Multer.File, acceptTypes: string[]): Promise<UploadFileDto> {
    let fileStream = null;
    if (file.path) {
      fileStream = fs.createReadStream(file.path);
    } else if (file.buffer) {
      fileStream = stream.Readable.from(file.buffer);
    } else {
      throw new Error('Uploaded file is missing content');
    }

    const bucketName = this.getConfig().bucketName;
    const fileInfoGenerated = generateFileUrl(file.originalname);
    if (acceptTypes.length > 0 && !acceptTypes.includes(fileInfoGenerated.ext)) {
      throw new RequestInvalidException('FILE_TYPE_UPLOAD_NOT_ACCEPT');
    }
    await this.minioClient.putObject(bucketName, fileInfoGenerated.fileName, fileStream, file.size);
    return fileInfoGenerated;
  }

  async uploadFileWithContent(data: string, fileName: string) {
    const bucketName = this.getConfig().bucketName;
    const jsonStream = stream.Readable.from([data]);
    await this.minioClient.putObject(bucketName, fileName, jsonStream, data.length, {
      'Content-Type': 'application/json',
    });
  }

  async deleteMultipleObjects(objectNames: string[]) {
    try {
      const bucketName = this.getConfig().bucketName;
      await this.minioClient.removeObjects(bucketName, objectNames);
    } catch (error) {
      throw new Error(`Failed to delete objects: ${error}`);
    }
  }

  async deleteObject(objectName: string): Promise<void> {
    try {
      const bucketName = this.getConfig().bucketName;
      await this.minioClient.removeObject(bucketName, objectName);
    } catch (error) {
      throw new Error(`Failed to delete object: ${error}`);
    }
  }

  async getJsonFileFromMinio(fileName: string): Promise<Buffer | null> {
    try {
      const bucketName = this.getConfig().bucketName;
      const dataStream = await this.minioClient.getObject(bucketName, fileName);
      const chunks: Buffer[] = [];
      for await (const chunk of dataStream) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);
      return fileBuffer;
    } catch (error) {
      console.error('Error fetching file from MinIO:', error);
      return null;
    }
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

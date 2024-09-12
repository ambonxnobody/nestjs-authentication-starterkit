import { Injectable } from '@nestjs/common';
import * as mime from 'mime-types';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { GetStorageDto } from './dto/get-storage.dto';

@Injectable()
export class StorageService {
  private minioClient: Minio.Client;
  private readonly bucketName: string;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: parseInt(process.env.MINIO_PORT) || 9000,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
    this.bucketName = process.env.MINIO_BUCKET_NAME;
  }

  async uploadFile(file: Express.Multer.File, folder: string) {
    const uuid = uuidv4();
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${uuid}.${fileExt}`;
    const contentType =
      mime.lookup(file.originalname) || 'application/octet-stream';
    await this.minioClient.putObject(
      this.bucketName,
      `${folder}/${fileName}`,
      file.buffer,
      file.size,
      {
        'Content-Type': contentType,
      },
    );
    return `${folder}/${fileName}`;
  }

  async findOne(getStorageDto: GetStorageDto) {
    const fileStream = await this.minioClient.getObject(
      this.bucketName,
      getStorageDto.path,
    );

    console.log('fileStream', fileStream);

    if (!fileStream) {
      return null;
    }

    const stat = await this.minioClient.statObject(
      this.bucketName,
      getStorageDto.path,
    );

    return {
      stream: fileStream,
      stat,
    };
  }

  async remove(getStorageDto: GetStorageDto) {
    await this.minioClient.removeObject(this.bucketName, getStorageDto.path);
  }
}

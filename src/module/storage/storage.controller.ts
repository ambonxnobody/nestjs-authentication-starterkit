import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  // UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';
import { StorageService } from './storage.service';
import { GetStorageDto } from './dto/get-storage.dto';
import { FileExtender } from '../../interceptor/file-extender.interceptor';
import { Public } from '../../decorator/public.decorator';

@Controller('api/file')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        bucket: {
          type: 'string',
          example: 'bucket-name',
        },
      },
    },
  })
  @UseInterceptors(FileExtender)
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    this.storageService
      .uploadFile(file, file['bucket'])
      .then((data) => {
        res.status(201).json({ path: data });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      })
      .finally(() => {
        res.end();
      });
  }

  @Public()
  @Get()
  async findOne(@Query() query: GetStorageDto, @Res() res: Response) {
    const { stream, stat } = await this.storageService.findOne(query);

    res.setHeader('Connection', 'close');
    res.setHeader('Cache-Control', 'no-cache, private');
    res.setHeader('Vary', 'Origin');
    res.setHeader(
      'Content-Type',
      stat.metaData['content-type'] || 'application/octet-stream',
    );

    stream.pipe(res);
  }

  @Delete()
  remove(@Query() query: GetStorageDto, @Res() res: Response) {
    this.storageService.remove(query).finally(() => {
      res.status(204).end();
    });
  }
}

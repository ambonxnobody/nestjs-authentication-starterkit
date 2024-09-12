import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetStorageDto {
  @ApiProperty({ example: 'path/to/file' })
  @IsString()
  @IsNotEmpty()
  path: string;
}

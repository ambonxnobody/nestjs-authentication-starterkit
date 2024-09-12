import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'read:permission',
  })
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Read permission',
  })
  @IsOptional()
  @MaxLength(150)
  @IsString()
  description: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'admin',
  })
  @MaxLength(50)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Administrator',
  })
  @IsOptional()
  @MaxLength(150)
  @IsString()
  description: string;
}

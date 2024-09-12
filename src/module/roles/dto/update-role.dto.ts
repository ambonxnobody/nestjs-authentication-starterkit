import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    example: ["9cfcff70-07bb-432b-aaa1-3b3aa77af1c2", "9cfcff70-0862-4eac-8e72-c6f8cc79a454", "9cfcff70-08f4-4494-b85d-bd01bd795ef8"],
  })
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  permissions: string[];
}

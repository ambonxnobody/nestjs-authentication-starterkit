import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({
    example: ["9cfcff70-07bb-432b-aaa1-3b3aa77af1c2", "9cfcff70-0862-4eac-8e72-c6f8cc79a454", "9cfcff70-08f4-4494-b85d-bd01bd795ef8"],
  })
  @IsArray()
  @IsString({ each: true })
  @IsUUID(4, { each: true })
  roles: string[];
}

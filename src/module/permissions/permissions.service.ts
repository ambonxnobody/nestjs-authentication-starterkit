import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { isUuid } from '../../helper';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionRepository.save(createPermissionDto);
  }

  findAll() {
    return this.permissionRepository.find({
      order:{
        created_at: 'DESC',
      }
    });
  }

  async findOne(id: string) {
    if (!isUuid(id)) {
      return null;
    }

    const permission = await this.permissionRepository.findOne({
      select: {
        name: true,
        description: true
      },
      where: { id },
    });

    if (!permission) {
      return null;
    }

    return permission;
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionRepository.update(id, updatePermissionDto);
  }

  remove(id: string) {
    return this.permissionRepository.delete(id);
  }

  async findByIds(ids: string[]) {
    return this.permissionRepository.findByIds(ids);
  }
}

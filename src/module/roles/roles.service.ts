import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { isUuid } from '../../helper';
import { PermissionRole } from '../permissions/entities/permission-role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(PermissionRole)
    private permissionRoleRepository: Repository<PermissionRole>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return this.roleRepository.save(createRoleDto);
  }

  findAll() {
    return this.roleRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    if (!isUuid(id)) {
      return null;
    }

    const role = await this.roleRepository.findOne({
      relations: ['permissions', 'permissions.permission'],
      select: {
        id: true,
        name: true,
        description: true,
        permissions: {
          id: true,
          permission: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      where: { id },
    });

    if (!role) {
      return null;
    }

    const flattenedPermissions = role.permissions.map((permission) => {
      return {
        id: permission.permission.id,
        name: permission.permission.name,
        description: permission.permission.description
      };
    });

    return {
      name: role.name,
      description: role.description,
      permissions: flattenedPermissions,
    };
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const updadtedRole: Role = {
      id,
      name: updateRoleDto.name,
      description: updateRoleDto.description,
    };

    await this.permissionRoleRepository.delete({ role: { id } });

    if (updateRoleDto.permissions.length > 0) {
      const permissionRoles = updateRoleDto.permissions.map((permission) => ({
        role: { id },
        permission: { id: permission },
      }));

      await this.permissionRoleRepository.insert(permissionRoles);
    }

    return this.roleRepository.update(id, updadtedRole);
  }

  remove(id: string) {
    return this.roleRepository.delete(id);
  }

  findByIds(ids: string[]) {
    return this.roleRepository.findByIds(ids);
  }
}

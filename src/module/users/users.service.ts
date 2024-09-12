import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Repository } from 'typeorm';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RoleUser } from '../roles/entities/role-user.entity';
import { isUuid } from '../../helper';
import { UserProfile } from './schemas/user-profile.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfile>,

    @InjectRepository(RoleUser)
    private roleUserRepository: Repository<RoleUser>,
  ) {}

  findAll() {
    return this.userRepository.find({
      order: {
        created_at: 'DESC',
      },
      select: {
        id: true,
        username: true,
        is_active: true,
        created_at: true,
      }
    });
  }

  findOne(id: string) {
    if (!isUuid(id)) {
      return null;
    }

    return this.userRepository.findOne({
      where: { id },
    });
  }

  accountActivation(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async assignRole(id: string, assignRoleDto: AssignRoleDto) {
    await this.roleUserRepository.delete({ user: { id } });

    if (assignRoleDto.roles.length === 0) {
      return;
    } else {
      const roleUsers = assignRoleDto.roles.map((role) => ({
        user: { id },
        role: { id: role },
      }));

      await this.roleUserRepository.insert(roleUsers);
    }

    return;
  }

  async findByEmailPhoneOrUsername(credential: string): Promise<User> {
    return this.userRepository.findOne({
      relations: ['roles', 'roles.role', 'roles.role.permissions', 'roles.role.permissions.permission'],
      select: {
        id: true,
        password: true,
        username: true,
        is_active: true,
      },
      where: [{ email: credential }, { phone: credential }, { username: credential }],
    });
  }

  async profile(id: string) {
    if (!isUuid(id)) {
      return null;
    }

    const userProfile = await this.userProfileModel
      .findOne({ user_id: id })
      .select('full_name nick_name -_id')
      .lean()
      .exec();

    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        username: true,
      },
    });

    return {
      ...userProfile,
      username: user.username,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: any) {
    if (!user.is_active) {
      return null;
    }

    const roles = [];
    const permissions = [];
    for (let i = 0; i < user.roles.length; i++) {
      roles.push(user.roles[i].role.name);
      for (let j = 0; j < user.roles[i].role.permissions.length; j++) {
        permissions.push(user.roles[i].role.permissions[j].permission.name);
      }
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roles,
      permissions
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(credential: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailPhoneOrUsername(credential);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_MODE_KEY, ROLES_KEY } from '../../decorator/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalRoleGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const checkMode = this.reflector.getAllAndOverride<string>(CHECK_MODE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || 'any';

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false;
    }

    if (checkMode === 'all') {
      return requiredRoles.every(role => user.roles.includes(role));
    } else {
      return requiredRoles.some(role => user.roles.includes(role));
    }
  }
}

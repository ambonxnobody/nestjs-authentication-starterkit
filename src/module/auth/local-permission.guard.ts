import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CHECK_MODE_KEY, PERMISSIONS_KEY } from '../../decorator/permissions.decorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalPermissionGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) return false;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) return true;

    const checkMode = this.reflector.getAllAndOverride<string>(CHECK_MODE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || 'any';

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.permissions || !Array.isArray(user.permissions)) {
      return false;
    }

    if (checkMode === 'all') {
      return requiredPermissions.every(permission => user.permissions.includes(permission));
    } else {
      return requiredPermissions.some(permission => user.permissions.includes(permission));
    }
  }
}

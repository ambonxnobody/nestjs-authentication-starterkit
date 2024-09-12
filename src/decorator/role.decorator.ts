import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const CHECK_MODE_KEY = 'check_mode';
export const Roles = (roles: string[], checkMode: 'all' | 'any' = 'any') => {
  return (target: Object, key?: string | symbol, descriptor?: PropertyDescriptor) => {
    SetMetadata(ROLES_KEY, roles)(target, key, descriptor);
    SetMetadata(CHECK_MODE_KEY, checkMode)(target, key, descriptor);
  };
};

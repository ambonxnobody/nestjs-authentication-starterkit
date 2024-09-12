import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const CHECK_MODE_KEY = 'check_mode';
export const Permissions = (permissions: string[], checkMode: 'all' | 'any' = 'any') => {
  return (target: Object, key?: string | symbol, descriptor?: PropertyDescriptor) => {
    SetMetadata(PERMISSIONS_KEY, permissions)(target, key, descriptor);
    SetMetadata(CHECK_MODE_KEY, checkMode)(target, key, descriptor);
  };
};

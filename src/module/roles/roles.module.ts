import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionRole } from '../permissions/entities/permission-role.entity';

@Module({
  imports: [
    PermissionsModule,
    TypeOrmModule.forFeature([Role, PermissionRole])
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}

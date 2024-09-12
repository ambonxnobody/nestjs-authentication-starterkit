import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth/auth.module';
import { PermissionsModule } from './module/permissions/permissions.module';
import { RolesModule } from './module/roles/roles.module';
import { SessionsModule } from './module/sessions/sessions.module';
import { StorageModule } from './module/storage/storage.module';
import { UsersModule } from './module/users/users.module';
import { Permission } from './module/permissions/entities/permission.entity';
import { PermissionRole } from './module/permissions/entities/permission-role.entity';
import { Role } from './module/roles/entities/role.entity';
import { RoleUser } from './module/roles/entities/role-user.entity';
import { Session } from './module/sessions/entities/session.entity';
import { User } from './module/users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        Permission, PermissionRole, Role, RoleUser, Session, User
      ],
      synchronize: false
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DATABASE,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          ttl: 60000,
          limit: 3
        }
      ]
    }),
    AuthModule,
    PermissionsModule,
    RolesModule,
    SessionsModule,
    StorageModule,
    UsersModule
  ]
})
export class AppModule {}

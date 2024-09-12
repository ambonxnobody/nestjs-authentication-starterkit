import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RoleUser } from '../roles/entities/role-user.entity';
import { RolesModule } from '../roles/roles.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProfile, UserProfileSchema } from './schemas/user-profile.schema';
import { UserSetting, UserSettingSchema } from './schemas/user-setting.schema';

@Module({
  imports: [
    RolesModule,
    TypeOrmModule.forFeature([User, RoleUser]),
    MongooseModule.forFeature([
      { name: UserProfile.name, schema: UserProfileSchema },
      { name: UserSetting.name, schema: UserSettingSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

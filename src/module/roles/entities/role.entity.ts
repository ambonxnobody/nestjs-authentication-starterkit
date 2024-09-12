import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleUser } from './role-user.entity';
import { PermissionRole } from '../../permissions/entities/permission-role.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RoleUser, userRole => userRole.role)
  users?: RoleUser[];

  @OneToMany(() => PermissionRole, permissionRole => permissionRole.role)
  permissions?: PermissionRole[];

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn({ select: false })
  updated_at?: Date;
}

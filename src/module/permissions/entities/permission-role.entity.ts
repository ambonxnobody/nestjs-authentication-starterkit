import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'permission_role' })
export class PermissionRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Permission, permission => permission.roles)
  @JoinColumn({ name: 'permission_id' })
  permission: Permission;

  @ManyToOne(() => Role, role => role.permissions)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;
}

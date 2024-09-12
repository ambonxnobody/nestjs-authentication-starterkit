import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleUser } from '../../roles/entities/role-user.entity';
import { Session } from '../../sessions/entities/session.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true, type: 'timestamp' })
  email_verified_at: Date;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'timestamp' })
  phone_verified_at: Date;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'boolean' })
  is_active: boolean;

  @Column({ nullable: true, select: false })
  remember_token: string;

  @OneToMany(() => RoleUser, userRole => userRole.user)
  roles: RoleUser[];

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

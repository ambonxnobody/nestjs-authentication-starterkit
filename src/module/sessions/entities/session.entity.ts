import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'sessions' })
export class Session {
  @Column({ primary: true })
  id: string;

  @ManyToOne(() => User, (user) => user.sessions, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, type: 'varchar', length: 45 })
  ip_address: string;

  @Column({ nullable: true, type: 'text' })
  user_agent: string;

  @Column({ type: 'text' })
  payload: string;

  @Column({ type: 'integer' })
  last_activity: number;
}

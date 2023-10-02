import { BaseEntityApp } from '@common/entities';
import { Column, Entity } from 'typeorm';

@Entity('admin_user')
export class AdminUser extends BaseEntityApp {
  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'user_name', nullable: true })
  userName: string;

  @Column({ type: 'varchar', name: 'password', nullable: false })
  password: string;

  @Column({ type: 'varchar', name: 'email', nullable: true })
  email: string;

  @Column({ type: 'varchar', name: 'token', nullable: true })
  token: string;
}

import { Column, Entity } from 'typeorm';

import { BaseEntityApp } from '@common/entities/base.entity';

@Entity('user')
export class User extends BaseEntityApp {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  userName: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;
}

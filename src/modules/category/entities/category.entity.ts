import { Column, Entity } from 'typeorm';
import { BaseEntityApp } from '@common/entities/base.entity';

@Entity('category')
export class Category extends BaseEntityApp {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;
}

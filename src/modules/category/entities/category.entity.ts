import { Column, Entity } from 'typeorm';
import { BaseEntityApp } from '@common/entities/base.entity';

@Entity('category')
export class Category extends BaseEntityApp {
  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'slug', nullable: true })
  slug: string;
}

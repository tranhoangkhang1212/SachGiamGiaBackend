import { BaseEntityApp } from '@common/entities';
import { Column, Entity } from 'typeorm';

@Entity('author')
export class Author extends BaseEntityApp {
  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'slug', nullable: true })
  slug: string;
}

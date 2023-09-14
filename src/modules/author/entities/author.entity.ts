import { BaseEntityApp } from '@common/entities';
import { Column, Entity } from 'typeorm';

@Entity('author')
export class Author extends BaseEntityApp {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;
}

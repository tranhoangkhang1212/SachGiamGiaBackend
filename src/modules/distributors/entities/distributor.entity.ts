import { BaseEntityApp } from '@common/entities';
import { Column, Entity } from 'typeorm';

@Entity('distributors')
export class Distributor extends BaseEntityApp {
  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'slug', nullable: true })
  slug: string;
}

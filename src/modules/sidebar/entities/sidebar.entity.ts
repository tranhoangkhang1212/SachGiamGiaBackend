import { BaseEntityApp } from '@common/entities';
import { ESidebarType } from 'src/constant/enum/sidebar-enum';
import { Column, Entity } from 'typeorm';

@Entity('side_bar')
export class Sidebar extends BaseEntityApp {
  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'slug', nullable: true })
  slug: string;

  @Column({ type: 'jsonb', name: 'category', nullable: false })
  category: string[];

  @Column({ type: 'jsonb', name: 'products', nullable: true })
  products: string[];

  @Column({ type: 'jsonb', name: 'sub_menu', nullable: true })
  subMenu: string[];

  @Column({ type: 'varchar', default: ESidebarType.Primary, name: 'type', nullable: true })
  type: ESidebarType;
}

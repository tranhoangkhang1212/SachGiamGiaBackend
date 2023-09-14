import { BaseEntityApp } from '@common/entities';
import { Column, Entity } from 'typeorm';
import { Category } from '@module/category/entities/category.entity';

@Entity('product')
export class Product extends BaseEntityApp {
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'varchar', name: 'author_id', nullable: false })
  author: string;

  @Column({ type: 'varchar', nullable: true })
  publisher: string;

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;
}

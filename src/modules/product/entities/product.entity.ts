import { BaseEntityApp } from '@common/entities';
import { Author } from '@module/author/entities/author.entity';
import { Category } from '@module/category/entities/category.entity';
import { Distributor } from '@module/distributors/entities/distributor.entity';
import { Publisher } from '@module/publisher/entities/publisher.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('product')
export class Product extends BaseEntityApp {
  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'sub_id', nullable: true })
  subId: string;

  @Column({ type: 'varchar', name: 'slug', nullable: false })
  slug: string;

  @Column({ type: 'varchar', name: 'image', nullable: false })
  image: string;

  @OneToOne(() => Author, { cascade: true })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @OneToOne(() => Distributor, { cascade: true })
  @JoinColumn({ name: 'distributor_id' })
  distributor: Distributor;

  @OneToOne(() => Publisher, { cascade: true })
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  @OneToOne(() => Category, { cascade: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'float8', name: 'price', nullable: true })
  price: number;

  @Column({ type: 'float8', name: 'final_price', nullable: true })
  finalPrice: number;

  @Column({ type: 'int4', name: 'sale_off', nullable: true })
  saleOff: number;

  @Column({ type: 'int8', name: 'total_view', nullable: true, default: 0 })
  totalView: number;

  @Column({ type: 'int8', name: 'total_buy', nullable: true, default: 0 })
  totalBuy: number;

  @Column({ type: 'int4', name: 'star', nullable: true, default: 0 })
  star: number;

  @Column({ type: 'varchar', name: 'description', nullable: true })
  description: string;
}

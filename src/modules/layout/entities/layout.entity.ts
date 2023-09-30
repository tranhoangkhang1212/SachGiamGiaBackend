import { BaseEntityApp } from '@common/entities';
import { Column, Entity } from 'typeorm';
import { HomeProductModel } from './home-product.model';
import { BannerModel } from './banner.model';

@Entity('layout')
export class Layout extends BaseEntityApp {
  @Column({ type: 'jsonb', name: 'home_products', nullable: false })
  homeProducts: HomeProductModel[] = [];

  @Column({ type: 'jsonb', name: 'banners', nullable: false })
  banners: BannerModel[] = [];
}

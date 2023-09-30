import { BaseEntityApp } from '@common/entities';
import { EResourceType } from 'src/constant/enum/resource-enum';
import { Column, Entity } from 'typeorm';

@Entity('resource')
export class Resource extends BaseEntityApp {
  @Column({ type: 'varchar', name: 'name', nullable: true })
  name: string;

  @Column({ type: 'varchar', name: 'url', nullable: false })
  url: string;

  @Column({ type: 'varchar', name: 'type', nullable: false })
  type: EResourceType;
}

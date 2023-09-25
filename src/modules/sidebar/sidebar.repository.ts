import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Sidebar } from './entities/sidebar.entity';

@EntityRepository(Sidebar)
@Injectable()
export class SidebarRepository extends Repository<Sidebar> {}

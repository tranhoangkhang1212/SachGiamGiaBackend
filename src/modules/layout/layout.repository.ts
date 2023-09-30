import { EntityRepository, Repository } from 'typeorm';
import { Layout } from './entities/layout.entity';

@EntityRepository(Layout)
export class LayoutRepository extends Repository<Layout> {}

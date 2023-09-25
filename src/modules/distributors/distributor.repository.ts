import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Distributor } from './entities/distributor.entity';

@EntityRepository(Distributor)
@Injectable()
export class DistributorRepository extends Repository<Distributor> {}

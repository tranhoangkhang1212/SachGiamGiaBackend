import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Publisher } from './entities/publisher.entity';

@EntityRepository(Publisher)
@Injectable()
export class PublisherRepository extends Repository<Publisher> {}

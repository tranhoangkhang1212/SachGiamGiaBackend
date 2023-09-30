import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Resource } from './entities/resource.entity';

@EntityRepository(Resource)
@Injectable()
export class ResourceRepository extends Repository<Resource> {}

import { EntityRepository, Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { Injectable } from '@nestjs/common';

@EntityRepository(Author)
@Injectable()
export class AuthorRepository extends Repository<Author> {}

import { EntityRepository, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AdminUser } from './entities/admin-user.entity';

@EntityRepository(AdminUser)
@Injectable()
export class AdminUserRepository extends Repository<AdminUser> {}

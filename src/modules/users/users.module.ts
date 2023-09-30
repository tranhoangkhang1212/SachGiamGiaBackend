import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AdminUserModule } from '@module/admin-user/admin-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({ secret: 'hard!to-guess_secret' }), AdminUserModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

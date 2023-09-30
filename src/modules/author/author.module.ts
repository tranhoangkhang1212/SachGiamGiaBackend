import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuthorController } from './author.admin.controller';
import { AuthorService } from './author.service';
import { Author } from './entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  controllers: [AdminAuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}

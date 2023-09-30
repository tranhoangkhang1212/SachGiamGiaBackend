import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';
import { AdminPublisherController } from './publisher.admin.controller';
import { Publisher } from './entities/publisher.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Publisher])],
  controllers: [AdminPublisherController],
  providers: [PublisherService],
})
export class PublisherModule {}

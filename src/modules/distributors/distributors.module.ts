import { Module } from '@nestjs/common';
import { DistributorsService } from './distributors.service';
import { DistributorsController } from './distributors.controller';
import { Distributor } from './entities/distributor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Distributor])],

  controllers: [DistributorsController],
  providers: [DistributorsService],
})
export class DistributorsModule {}

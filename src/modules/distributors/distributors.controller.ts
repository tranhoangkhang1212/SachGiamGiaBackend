import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DistributorsService } from './distributors.service';
import { CreateDistributorDto } from './dto/create-distributor.dto';
import { FindAllRequestDto } from '@module/author/dto/find-all-request.dto';

@Controller('distributor')
export class DistributorsController {
  constructor(private readonly distributorsService: DistributorsService) {}

  @Post()
  create(@Body() createDistributorDto: CreateDistributorDto) {
    return this.distributorsService.create(createDistributorDto);
  }

  @Get()
  findAll(@Query() requestDto: FindAllRequestDto) {
    return this.distributorsService.findAllDistributor(requestDto);
  }
}

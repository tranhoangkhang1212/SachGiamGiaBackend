import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublisherService } from './publisher.service';
import { FindAllRequestDto } from '@module/author/dto/find-all-request.dto';

@Controller('publisher')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post()
  create(@Body() createPublisherDto: CreatePublisherDto) {
    return this.publisherService.create(createPublisherDto);
  }

  @Get()
  findAll(@Query() requestDto: FindAllRequestDto) {
    return this.publisherService.findAllPublisher(requestDto);
  }
}

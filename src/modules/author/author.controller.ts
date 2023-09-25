import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FindAllRequestDto } from './dto/find-all-request.dto';

@Controller('author')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  findAll(@Query() requestDto: FindAllRequestDto) {
    return this.authorService.findAllAuthors(requestDto);
  }
}

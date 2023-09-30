import { ActionResponseDto } from '@common/response/action-response.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserRequestDto): Promise<ActionResponseDto> {
    return this.usersService.create(createUserDto);
  }
}

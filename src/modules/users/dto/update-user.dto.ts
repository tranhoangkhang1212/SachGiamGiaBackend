import { PartialType } from '@nestjs/swagger';
import { CreateUserRequestDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserRequestDto) {}

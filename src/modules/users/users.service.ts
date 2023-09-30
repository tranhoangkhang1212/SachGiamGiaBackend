import { ActionResponseDto } from '@common/response/action-response.dto';
import { BaseService } from '@common/services/base.service';
import { AdminUserService } from '@module/admin-user/admin-user.service';
import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { IUserTokenBody } from './dto/user-token-body.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private adminUserService: AdminUserService,
  ) {
    super();
    this._entity = User;
    this._model = this.userRepository;
  }
  async create(requestDto: CreateUserRequestDto): Promise<ActionResponseDto> {
    const responseDto: ActionResponseDto = new ActionResponseDto();

    try {
      const passwordHash = this.jwtService.sign(requestDto, {
        secret: process.env.ADMIN_AUTH_SECRET_KEY,
      });
      await this.userRepository.save({ ...requestDto, password: passwordHash });
      responseDto.message = 'Sign up successfully!';
      console.log(passwordHash);
    } catch (error) {
      console.error(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }

    return responseDto;
  }

  async getUserDataFromToken(token: string): Promise<IUserTokenBody> {
    try {
      return (await this.jwtService.decode(token)) as IUserTokenBody;
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }

  async validateAdminToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.ADMIN_AUTH_SECRET_KEY,
      });
      await this.adminUserService.validateToken(token);
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }

  async validateClientToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.CLIENT_AUTH_SECRET_KEY,
      });
    } catch (error) {
      console.log(error);
      throw new ForbiddenException();
    }
  }
}

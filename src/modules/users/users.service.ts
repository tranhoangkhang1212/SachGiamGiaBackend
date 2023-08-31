import { ActionResponseDto } from '@common/response/action-response.dto';
import { BaseService } from '@common/services/base.service';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserData, UserResponseDto } from './dto/userResponse.dto';
import { User } from './entities/user.entity';
import { IUserTokenBody } from './dto/user-token-body.dto';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
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

  async getAll(): Promise<UserResponseDto[]> {
    const data = await this.userRepository.find();

    const userData: UserData[] = [
      {
        age: (Math.random() * 10).toString(),
        location: (Math.random() + 1).toString(36).substring(7),
        pass: (Math.random() + 1).toString(36).substring(7),
      },
      {
        age: (Math.random() * 10).toString(),
        location: (Math.random() + 1).toString(36).substring(7),
        pass: (Math.random() + 1).toString(36).substring(7),
      },
      {
        age: (Math.random() * 10).toString(),
        location: (Math.random() + 1).toString(36).substring(7),
        pass: (Math.random() + 1).toString(36).substring(7),
      },
      {
        age: (Math.random() * 10).toString(),
        location: (Math.random() + 1).toString(36).substring(7),
        pass: (Math.random() + 1).toString(36).substring(7),
      },
      {
        age: (Math.random() * 10).toString(),
        location: (Math.random() + 1).toString(36).substring(7),
        pass: (Math.random() + 1).toString(36).substring(7),
      },
    ];

    const response: UserResponseDto[] = data.map((user) => {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        userName: user.userName,
        password: user.password,
        userData: userData,
      };
    });

    return response;
  }

  getOne(id: number) {
    return `This action returns a #${id} user`;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  removeUser(id: number) {
    return `This action removes a #${id} user`;
  }

  getUserDataFromToken(token: string): IUserTokenBody {
    try {
      return this.jwtService.decode(token) as IUserTokenBody;
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  async validateAdminToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.ADMIN_AUTH_SECRET_KEY,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
    } catch {
      throw new ForbiddenException();
    }
  }

  async validateClientToken(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.CLIENT_AUTH_SECRET_KEY,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
    } catch {
      throw new ForbiddenException();
    }
  }
}

import { BaseService } from '@common/services/base.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { AdminUserRepository } from './admin-user.repository';
import { RegisterRequestDto } from './dto/register-request.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { AdminUser } from './entities/admin-user.entity';
import { HashService } from '@module/hash/hash.service';

@Injectable()
export class AdminUserService extends BaseService {
  constructor(
    @InjectRepository(AdminUser)
    private adminUserRepository: AdminUserRepository,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {
    super();
    this._entity = AdminUser;
    this._model = this.adminUserRepository;
  }

  async register(requestDto: RegisterRequestDto) {
    const user = await this.adminUserRepository.findOne({
      where: [{ userName: requestDto.userName }, { email: requestDto.email }],
    });
    if (user) {
      throw new RequestInvalidException('USER_ALREADY_EXISTS');
    }

    const { name, userName, email } = requestDto;
    const password = this.hashService.hashPassword(requestDto.password);
    await this.createAndSave({ name, userName, email, password, token: null });
  }

  async signIn(requestDto: SignInRequestDto): Promise<SignInResponseDto> {
    if (!requestDto.email) {
      throw new RequestInvalidException('EMAIL_INVALID');
    }
    if (!requestDto.password) {
      throw new RequestInvalidException('PASSWORD_INVALID');
    }

    const user = await this.adminUserRepository.findOne({
      where: [{ email: requestDto.email }],
    });

    if (!user) {
      throw new RequestInvalidException('USER_NOT_FOUND');
    }
    if (!this.hashService.verifyPassword(requestDto.password, user.password)) {
      throw new RequestInvalidException('PASSWORD_INVALID');
    }

    const payload = { id: user.id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.ADMIN_AUTH_SECRET_KEY,
    });
    user.token = token;
    await this.adminUserRepository.save(user);
    return new SignInResponseDto(user.id, user.name, user.email, token);
  }

  async validateToken(token: string) {
    const payload: TokenPayloadDto = await this.jwtService.verifyAsync(token, {
      secret: process.env.ADMIN_AUTH_SECRET_KEY,
    });
    const user = await this.adminUserRepository.findOne({
      where: [{ id: payload.id }],
    });

    if (!user) {
      throw new RequestInvalidException('USER_NOT_FOUND');
    }
    if (user.token !== token) {
      throw new UnauthorizedException();
    }
  }
}

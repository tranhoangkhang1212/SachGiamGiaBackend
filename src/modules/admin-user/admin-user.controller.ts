import { AdminGuard } from '@module/auth/auth.admin.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { SignInRequestDto } from './dto/sign-in-request.dto';

@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @UseGuards(AdminGuard)
  @Post('register')
  async register(@Body() requestDto: RegisterRequestDto) {
    return this.adminUserService.register(requestDto);
  }

  @UseGuards(AdminGuard)
  @Post('sign-in')
  async signIn(@Body() requestDto: SignInRequestDto) {
    return this.adminUserService.signIn(requestDto);
  }
}

import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { RegisterRequestDto } from './dto/register-request.dto';
import { AdminGuard } from '@module/auth/auth.admin.guard';
import { SignInRequestDto } from './dto/sign-in-request.dto';

@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get('register')
  async register(@Body() requestDto: RegisterRequestDto) {
    return this.adminUserService.register(requestDto);
  }

  @UseGuards(AdminGuard)
  @Get('sign-in')
  async signIn(@Body() requestDto: SignInRequestDto) {
    return this.adminUserService.signIn(requestDto);
  }
}

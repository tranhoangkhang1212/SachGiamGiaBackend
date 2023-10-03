import { ERole } from '@common/role/role.enum';
import { IUserTokenBody } from '@module/users/dto/user-token-body.dto';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { globalRoutes } from 'src/constant/APIConstant';
import { UsersService } from './../users/users.service';

@Injectable()
export class DefaultAuthGuard implements CanActivate {
  constructor(private userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUrl = request.originalUrl;
    if (globalRoutes.includes(requestUrl)) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    if (!(await this.validateRequest(requestUrl, token))) {
      throw new ForbiddenException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split('||') ?? [];
    return type === 'token' ? token : undefined;
  }

  private async validateRequest(path: string, token: string): Promise<boolean> {
    try {
      if (path.includes('admin')) {
        await this.userService.validateAdminToken(token);
        return this.validateAdminPath(token);
      }
      if (path.includes('api/user/')) {
        await this.userService.validateClientToken(token);
        return this.validateClientPath(token);
      }
      return token === process.env.HARD_TOKEN;
    } catch (error) {
      console.error(error);
      throw new ForbiddenException();
    }
  }

  private async validateAdminPath(token: string): Promise<boolean> {
    const userData = this.userService.getUserDataFromToken(token);
    if (!userData) {
      throw new ForbiddenException();
    }
    return true;
  }

  private validateClientPath(token: string): boolean {
    const userData: IUserTokenBody = this.userService.getUserDataFromToken(token);
    if (!userData || !userData.email || userData.role !== ERole.User) {
      throw new ForbiddenException();
    }
    return true;
  }
}

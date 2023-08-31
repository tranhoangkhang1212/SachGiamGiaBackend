import { ERole } from '@module/role/role.enum';

export interface IUserTokenBody {
  name: string;
  email: string;
  role: ERole;
}

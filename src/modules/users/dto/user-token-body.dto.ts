import { ERole } from '@common/role/role.enum';

export interface IUserTokenBody {
  name: string;
  email: string;
  role: ERole;
}

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  userName: string;
  password: string;
  userData: UserData[];
}

export interface UserData {
  age: string;
  pass: string;
  location: string;
}

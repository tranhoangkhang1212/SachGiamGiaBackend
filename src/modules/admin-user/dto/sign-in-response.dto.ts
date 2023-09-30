export class SignInResponseDto {
  constructor(id: string, name: string, email: string, token: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.token = token;
  }
  id: string;
  name: string;
  email: string;
  token: string;
}

export class UpdateMenuRequestDto {
  name: string;
  url: string;
}

export class UpdateBaseLayoutRequestDto {
  address: string;
  phone: string;
  email: string;
  direction: UpdateMenuRequestDto[];
  policy: UpdateMenuRequestDto[];
}

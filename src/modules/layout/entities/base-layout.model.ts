export class BaseLayoutMenuModel {
  name: string;
  url: string;
}

export class BaseLayoutModel {
  phone: string;
  address: string;
  email: string;
  direction: BaseLayoutMenuModel[] = [];
  policy: BaseLayoutMenuModel[] = [];
}

import { EStatus } from 'src/constant/enum/status-eum';

export class HomeProductModel {
  name: string;
  slug: string;
  productsShow: string[];
  category: string[];
  authors: string[];
  publishers: string[];
  distributors: string[];
  products: string[];
  status: EStatus;
}

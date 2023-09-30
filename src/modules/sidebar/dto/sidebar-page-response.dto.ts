import { AuthorResponse, ShortProductResponseDto } from '@module/product/dto/products-response';
import { ESidebarType } from 'src/constant/enum/sidebar-enum';

export class SidebarPageResponseDto {
  name: string;
  slug: string;
  subMenu: string[] = [];
  distributor: AuthorResponse[] = [];
  author: AuthorResponse[] = [];
  publisher: AuthorResponse[] = [];
  category?: AuthorResponse[] = [];
  products: ShortProductResponseDto[] = [];
  type: ESidebarType;
  productShow?: ShortProductResponseDto[] = [];
}

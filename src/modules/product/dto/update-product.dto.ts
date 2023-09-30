export class UpdateProductDto {
  id: string;
  statistics: string;
  description: string;
  saleOff: number;
  price: number;
  name: string;
  slug?: string;
  images: string[];
}

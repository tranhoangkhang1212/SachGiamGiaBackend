import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { ESidebarType } from 'src/constant/enum/sidebar-enum';

export class CreateSidebarDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;

  @IsArray()
  category: string[] = [];

  @IsArray()
  products: string[] = [];

  @IsArray()
  authors: string[] = [];

  @IsArray()
  publishers: string[] = [];

  @IsArray()
  distributors: string[] = [];

  @IsArray()
  subMenu: string[] = [];

  @IsEnum(ESidebarType)
  type: ESidebarType;
}

import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { ESidebarType } from 'src/constant/enum/sidebar-enum';

export class CreateSidebarDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  category: string[] = [];

  @IsArray()
  products: string[] = [];

  @IsArray()
  subMenu: string[] = [];

  @IsEnum(ESidebarType)
  type: ESidebarType;
}

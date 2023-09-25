import { IsNotEmpty } from 'class-validator';

export class SidebarSearchRequestDto {
  @IsNotEmpty()
  slug: string;
}

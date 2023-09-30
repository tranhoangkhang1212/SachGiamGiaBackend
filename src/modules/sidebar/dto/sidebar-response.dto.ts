import { ESidebarType } from 'src/constant/enum/sidebar-enum';

class SideBarResponse {
  name: string;
  slug: string;
  type: ESidebarType;
}

export class SidebarResponseDto extends SideBarResponse {
  subMenu: SideBarResponse[];
}

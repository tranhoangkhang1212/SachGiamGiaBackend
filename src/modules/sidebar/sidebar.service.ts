import { BaseService } from '@common/services/base.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ESidebarType } from 'src/constant/enum/sidebar-enum';
import { RequestInvalidException } from 'src/exception/request-invalid.exception';
import { sleep, slugGenerate } from 'src/utils/common-util';
import { CreateSidebarDto } from './dto/create-sidebar.dto';
import { SidebarResponseDto } from './dto/sidebar.response-dto';
import { Sidebar } from './entities/sidebar.entity';
import { SidebarRepository } from './sidebar.repository';
import { TErrorKey } from 'src/constant/exception-code';

@Injectable()
export class SidebarService extends BaseService {
  constructor(
    @InjectRepository(Sidebar)
    private sidebarRepository: SidebarRepository,
  ) {
    super();
    this._entity = Sidebar;
    this._model = this.sidebarRepository;
  }

  async create(createSidebarDto: CreateSidebarDto) {
    const { name, category, subMenu, products } = createSidebarDto;
    const sidebar = await this.sidebarRepository.findOne({ where: { name } });
    if (sidebar) {
      throw new RequestInvalidException('SIDE_BAR_NAME_ALREADY_EXISTS');
    }
    const { hasError, errorMsgKey } = await this.validateSubMenu(subMenu);
    if (hasError) {
      throw new RequestInvalidException(errorMsgKey as TErrorKey);
    }
    return this.createAndSave({ ...createSidebarDto, slug: slugGenerate(name) });
  }

  async getAll(): Promise<SidebarResponseDto[]> {
    const sideBars = await this.sidebarRepository.find({ where: { type: ESidebarType.Primary } });

    const response: SidebarResponseDto[] = await Promise.all(
      sideBars.map(async (sidebar) => {
        const subMenu = await Promise.all(
          sidebar.subMenu.map(async (id) => {
            const menuData = await this.findById(id);
            return this.getSideBarResponse(menuData);
          }),
        );

        return {
          ...this.getSideBarResponse(sidebar),
          subMenu,
        };
      }),
    );
    return response;
  }

  getSideBarResponse(entity: Sidebar) {
    return { name: entity.name, type: entity.type, slug: entity.slug };
  }

  async validateSubMenu(ids: string[]) {
    let hasError = false;
    let errorMsgKey = '';
    for await (const id of ids) {
      const subMenu = await this.sidebarRepository.findOne(id);
      if (!subMenu) {
        hasError = true;
        errorMsgKey = 'SIDE_BAR_SUB_MENU_NOT_FOUND';
        break;
      }
      if (subMenu.type !== ESidebarType.SubMenu) {
        hasError = true;
        errorMsgKey = 'SIDE_BAR_ARE_NOT_SUB_MENU';
        break;
      }
    }
    return {
      hasError,
      errorMsgKey,
    };
  }
}

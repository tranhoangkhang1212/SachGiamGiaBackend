import { Injectable } from '@nestjs/common';
import { CreateSidebarDto } from './dto/create-sidebar.dto';
import { UpdateSidebarDto } from './dto/update-sidebar.dto';

@Injectable()
export class SidebarService {
  create(createSidebarDto: CreateSidebarDto) {
    return 'This action adds a new sidebar';
  }

  findAll() {
    return `This action returns all sidebar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sidebar`;
  }

  update(id: number, updateSidebarDto: UpdateSidebarDto) {
    return `This action updates a #${id} sidebar`;
  }

  remove(id: number) {
    return `This action removes a #${id} sidebar`;
  }
}

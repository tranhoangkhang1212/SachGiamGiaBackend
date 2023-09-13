import { Module } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { SidebarController } from './sidebar.controller';

@Module({
  controllers: [SidebarController],
  providers: [SidebarService]
})
export class SidebarModule {}

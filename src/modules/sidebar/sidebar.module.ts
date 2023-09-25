import { Module } from '@nestjs/common';
import { SidebarService } from './sidebar.service';
import { SidebarController } from './sidebar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sidebar } from './entities/sidebar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sidebar])],
  controllers: [SidebarController],
  providers: [SidebarService],
})
export class SidebarModule {}

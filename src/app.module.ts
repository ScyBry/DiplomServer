import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './department/department.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [DepartmentModule, GroupModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

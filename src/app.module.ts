import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './department/department.module';
import { GroupModule } from './group/group.module';
import { SubjectModule } from './subject/subject.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [DepartmentModule, GroupModule, SubjectModule, TeacherModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

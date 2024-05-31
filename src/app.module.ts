import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './department/department.module';
import { GroupModule } from './group/group.module';
import { SubjectModule } from './subject/subject.module';
import { TeacherModule } from './teacher/teacher.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CabinetModule } from './cabinet/cabinet.module';

@Module({
  imports: [
    DepartmentModule,
    GroupModule,
    SubjectModule,
    TeacherModule,
    UserModule,
    AuthModule,
    ScheduleModule,
    CabinetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

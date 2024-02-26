import { Body, Controller, Patch, Post, Query } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('createTeacher')
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @Patch('updateTeacher')
  update(@Body() updateTeacherDto: UpdateTeacherDto, @Query('id') id: string) {
    return this.teacherService.update(id, updateTeacherDto);
  }
}

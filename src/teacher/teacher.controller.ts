import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeacherService } from './teacher.service';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('createTeacher')
  create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Get('getAllTeachers')
  getAllTeachers() {
    return this.teacherService.getAll();
  }

  @Patch('updateTeacher')
  update(@Body() updateTeacherDto: UpdateTeacherDto, @Query('id') id: string) {
    return this.teacherService.updateTeacher(id, updateTeacherDto);
  }
}

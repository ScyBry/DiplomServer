import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectService } from './subject.service';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post('createSubject')
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Get('getAllGroupSubjects')
  getAllGroupSubjects(@Query('groupId') groupId: string) {
    return this.subjectService.getAllGroupSubjects(groupId);
  }

  // @Get('getAllSubjects')
  // getAllSubjects() {
  //   return this.subjectService.getAllSubjects();
  // }

  @Delete('deleteSubject')
  deleteSubject(@Query('id') id: string) {
    return this.subjectService.deleteSubject(id);
  }

  @Patch('updateSubject')
  updateSubject(
    @Query('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ) {
    return this.subjectService.updateSubject(id, updateSubjectDto);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: createSubjectDto,
    });
  }

  async getAllGroupSubjects(id: string) {
    return this.prisma.subject.findMany({
      where: {
        groupId: id,
      },
      include: { teachers: true },
    });
  }

  async findAllSubjects() {
    return this.prisma.subject.findMany();
  }

  async findSubjectById(id: string) {
    return this.prisma.subject.findUnique({
      where: { id },
    });
  }

  async updateSubject(
    id: string,
    updateSubjectDto: UpdateSubjectDto,
  ): Promise<any> {
    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
    });
  }

  async deleteSubject(id: string): Promise<any> {
    return this.prisma.subject.delete({
      where: { id },
    });
  }

  // async addTeacherToSubject(
  //   subjectId: string,
  //   teacherId: string,
  // ): Promise<any> {
  //   return this.prisma.subject.update({
  //     where: { id: subjectId },
  //     data: {
  //       teachers: {
  //         connect: { id: teacherId },
  //       },
  //     },
  //   });
  // }

  // async removeTeacherFromSubject(
  //   subjectId: string,
  //   teacherId: string,
  // ): Promise<any> {
  //   return this.prisma.subject.update({
  //     where: { id: subjectId },
  //     data: {
  //       teachers: {
  //         disconnect: { teacherId: teacherId },
  //       },
  //     },
  //   });
  // }
}

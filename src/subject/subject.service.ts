import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    const isSubjectExists = await this.prisma.subject.findFirst({
      where: {
        AND: [
          { name: createSubjectDto.name },
          { groupId: createSubjectDto.groupId },
        ],
      },
    });

    if (isSubjectExists)
      throw new ConflictException('Предмет с таким названием уже добавлен');

    return this.prisma.subject.create({
      data: {
        name: createSubjectDto.name,
        hoursPerGroup: createSubjectDto.hoursPerGroup,
        Group: {
          connect: {
            id: createSubjectDto.groupId,
          },
        },
      },
    });
  }

  async updateSubject(id: string, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.prisma.subject.findFirst({
      where: { id },
    });

    if (!subject) throw new NotFoundException('Предмет не найден');

    return await this.prisma.subject.update({
      where: { id: id },
      data: {
        name: updateSubjectDto.name,
        hoursPerGroup: updateSubjectDto.hoursPerGroup,
      },
    });
  }

  async getAllGroupSubjects(id: string) {
    const subjects = await this.prisma.subject.findMany({
      where: { groupId: id },
      include: { teachers: true },
    });

    const teacherIds = new Set<string>();

    for (const subject of subjects) {
      for (const teacher of subject.teachers) {
        teacherIds.add(teacher.teacherId);
      }
    }

    const teachers =
      teacherIds.size > 0
        ? await this.prisma.teacher.findMany({
            where: { id: { in: Array.from(teacherIds) } },
          })
        : [];

    const teacherMap = new Map<string, any>();
    for (const teacher of teachers) {
      teacherMap.set(teacher.id, teacher);
    }

    const processedSubjects = subjects.map((subject) => {
      const subjectTeachers = subject.teachers.map((teacher) => {
        return teacherMap.get(teacher.teacherId) || {};
      });
      return { ...subject, teachers: subjectTeachers };
    });

    return processedSubjects;
  }

  async findAllSubjects() {
    return this.prisma.subject.findMany();
  }

  async findSubjectById(id: string) {
    return this.prisma.subject.findUnique({
      where: { id },
    });
  }

  async deleteSubject(id: string): Promise<any> {
    const isSubjectExists = await this.prisma.subject.findFirst({
      where: { id },
    });

    if (!isSubjectExists) throw new NotFoundException('Предмет не найден');

    await this.prisma.teacherSubject.deleteMany({
      where: {
        subjectId: id,
      },
    });

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

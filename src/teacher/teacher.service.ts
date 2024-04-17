import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.teacher.findMany();
  }

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const isTeacherExists = await this.prisma.teacher.findFirst({
      where: {
        AND: [
          { firstName: createTeacherDto.firstName },
          { lastName: createTeacherDto.lastName },
          { surname: createTeacherDto.surname },
        ],
      },
    });

    if (isTeacherExists)
      throw new ConflictException('Преподаватель уже существует');

    return this.prisma.teacher.create({
      data: createTeacherDto,
    });
  }

  async getTeacher(id: string) {
    const teacher = this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) throw new NotFoundException('Преподаватель не найден');

    return teacher;
  }

  async getTeachers() {
    return this.prisma.teacher.findMany();
  }

  async updateTeacher(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { id },
    });

    if (!teacher) throw new NotFoundException('Преподаватель не найден');

    return this.prisma.teacher.update({
      where: { id },
      data: updateTeacherDto,
    });
  }

  async deleteTeacher(id: string) {
    return this.prisma.teacher.delete({
      where: { id },
    });
  }

  async assignSubjectsToTeacher(teacherId: string, subjectsIds: string[]) {
    return this.prisma.teacherSubject.createMany({
      data: subjectsIds.map((subject) => ({
        teacherId,
        subjectId: subject,
      })),
    });
  }

  async getSubjectByTeacher(teacherId: string) {
    const teacherSubjects = await this.prisma.teacherSubject.findMany({
      where: { teacherId },
      include: { subject: true },
    });

    return teacherSubjects.map((teacherSubject) => teacherSubject.subject);
  }

  async removeSubjectFromTeacher(teacherId: string, subjectId: string) {
    return this.prisma.teacherSubject.delete({
      where: {
        teacherId_subjectId: {
          teacherId,
          subjectId,
        },
      },
    });
  }

  // async create(createTeacherDto: CreateTeacherDto) {
  //   const teacher = await this.prisma.teacher.findFirst({
  //     where: {
  //       firstName: createTeacherDto.firstName,
  //       lastName: createTeacherDto.lastName,
  //       surname: createTeacherDto.surname,
  //     },
  //   });

  //   if (teacher) throw new ConflictException('Преподаватель уже существует');

  //   return this.prisma.teacher.create({
  //     data: { ...createTeacherDto },
  //   });
  // }

  // async update(id: string, updateTeacherDto: UpdateTeacherDto) {
  //   const teacher = await this.prisma.teacher.findUnique({
  //     where: {
  //       id,
  //     },
  //   });

  //   if (!teacher) throw new NotFoundException('Преподаватель не найден');

  //   return this.prisma.teacher.update({
  //     where: {
  //       id,
  //     },
  //     data: { ...updateTeacherDto },
  //   });
  // }
}

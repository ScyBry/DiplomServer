import {
  BadRequestException,
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
      data: {
        firstName: createTeacherDto.firstName,
        lastName: createTeacherDto.lastName,
        surname: createTeacherDto.surname,
        totalHours: createTeacherDto.totalHours,
        fullName: `${createTeacherDto.lastName} ${createTeacherDto.firstName} ${createTeacherDto.surname}`,
      },
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
      data: { ...updateTeacherDto },
    });
  }

  async deleteTeacher(id: string) {
    return this.prisma.teacher.delete({
      where: { id },
    });
  }

  async assignSubjectsToTeacher(
    teachers: { teachers: any[] },
    subjectId: string,
  ) {
    const deletedSubjects = await this.prisma.teacherSubject.deleteMany({
      where: {
        subjectId,
      },
    });

    if (!deletedSubjects) throw new BadRequestException('Что-то пошло не так');

    return await Promise.all(
      teachers.teachers.map((teacher) =>
        this.prisma.teacherSubject.create({
          data: {
            teacher: { connect: { id: teacher.id } },
            subject: { connect: { id: subjectId } },
          },
        }),
      ),
    );
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
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const { departmentId, teachersId, ...data } = createSubjectDto;

    const existingSubject = await this.prisma.subject.findUnique({
      where: { name: data.name },
    });

    if (existingSubject)
      throw new ConflictException('Этот предмет уже существует');

    const teachers = await this.prisma.teacher.findMany({
      where: { id: { in: teachersId } },
    });

    if (!teachers) throw new BadRequestException('Что-то пошло не так');

    return this.prisma.subject.create({
      data: {
        ...data,
        Department: { connect: { id: departmentId } },
        teachers: {
          connect: teachers.map((teacher) => ({ id: teacher.id })),
        },
      },
    });
  }
}

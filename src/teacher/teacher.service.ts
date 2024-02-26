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

  async create(createTeacherDto: CreateTeacherDto) {
    const teacher = await this.prisma.teacher.findFirst({
      where: {
        firstName: createTeacherDto.firstName,
        lastName: createTeacherDto.lastName,
        surname: createTeacherDto.surname,
      },
    });

    if (teacher) throw new ConflictException('Преподаватель уже существует');

    return await this.prisma.teacher.create({
      data: { ...createTeacherDto },
    });
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) throw new NotFoundException('Преподаватель не найден');

    return this.prisma.teacher.update({
      where: {
        id,
      },
      data: { ...updateTeacherDto },
    });
  }
}

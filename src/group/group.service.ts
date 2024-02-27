import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    const existingDepartment = await this.prisma.department.findUnique({
      where: { id: createGroupDto.departmentId },
    });

    if (!existingDepartment)
      throw new NotFoundException('Отделение не найдено');

    const existingGroup = await this.prisma.group.findUnique({
      where: { name: createGroupDto.name },
    });

    if (existingGroup)
      throw new ConflictException('Группа с таким названием уже существует');

    return this.prisma.group.create({
      data: {
        name: createGroupDto.name,
        Department: { connect: { id: createGroupDto.departmentId } },
      },
    });
  }

  findAll() {
    return this.prisma.group.findMany();
  }

  async findOne(id: string, withSubjects: boolean) {
    if (withSubjects)
      return this.prisma.group.findUnique({
        where: { id },
        include: { subjects: true },
      });

    return this.prisma.group.findUnique({ where: { id } });
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) throw new NotFoundException('Группа не найдена');

    return this.prisma.group.update({
      where: { id },
      data: { ...updateGroupDto },
    });
  }

  async remove(id: string) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) throw new NotFoundException('Группа не найдена');

    return this.prisma.group.delete({ where: { id } });
  }
}

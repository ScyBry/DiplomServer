import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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

    if (!existingDepartment)
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

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) throw new NotFoundException('Группа не найдена');

    return this.prisma.group.update({
      where: { id },
      data: { ...updateGroupDto },
    });
  }

  async remove(id: number) {
    const group = await this.prisma.group.findUnique({ where: { id } });

    if (!group) throw new NotFoundException('Группа не найдена');

    return this.prisma.group.delete({ where: { id } });
  }
}

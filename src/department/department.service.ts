import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const isExists = await this.prisma.department.findUnique({
      where: { name: createDepartmentDto.name },
    });

    if (isExists)
      throw new ConflictException('Отделение с таким именем уже существует');

    return this.prisma.department.create({ data: { ...createDepartmentDto } });
  }

  async getAll() {
    return this.prisma.department.findMany({
      include: { groups: true },
    });
  }

  async findOne(id: number) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: { groups: true },
    });

    if (!department) throw new NotFoundException('Отделение не найдено');

    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const existingDepartment = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!existingDepartment)
      throw new NotFoundException('Отделение не найдено');

    return this.prisma.department.update({
      where: { id: existingDepartment.id },
      data: { ...updateDepartmentDto },
    });
  }

  async delete(id: number) {
    const existingDepartment = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!existingDepartment)
      throw new NotFoundException('Отделение не найдено');

    return this.prisma.department.delete({
      where: { id: existingDepartment.id },
    });
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DaySchedule } from '@prisma/client';
import * as Excel from 'exceljs';

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

  async getAll(withGroups: boolean) {
    if (withGroups)
      return this.prisma.department.findMany({
        include: {
          groups: {
            include: {
              subjects: true,
            },
          },
        },
      });

    return this.prisma.department.findMany();
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: { groups: true },
    });

    if (!department) throw new NotFoundException('Отделение не найдено');

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    console.log(updateDepartmentDto);
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

  async delete(id: string) {
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

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getGroupsSchedule(groupId: string) {
    const isGroupExists = await this.prisma.group.findFirst({
      where: { id: groupId },
    });

    if (!isGroupExists) throw new NotFoundException('Группа не найдена...');

    return this.prisma.daySchedule.findMany({
      where: {
        groupId,
      },
      include: {
        Group: true,
        scheduleSubjects: {
          orderBy: {
            orderNumber: 'asc',
          },
        },
      },
    });
  }

  async exportToExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Day Schedules');

    // Получение данных из базы данных
    const data = await this.prisma.department.findMany({
      include: {
        groups: {
          include: {
            daySchedules: {
              include: {
                scheduleSubjects: {
                  include: {
                    DaySchedule: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Установка заголовков таблицы
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'Расписание занятий';
    worksheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    worksheet.getCell('A1').font = { size: 14, bold: true };

    worksheet.addRow([
      'Кафедра',
      'Группа',
      'День недели',
      'Номер аудитории',
      'Порядковый номер',
    ]);

    // Применение стилей к заголовкам
    worksheet.getRow(2).eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Добавление данных в таблицу
    data.forEach((department) => {
      department.groups.forEach((group) => {
        group.daySchedules.forEach((daySchedule) => {
          daySchedule.scheduleSubjects.forEach((scheduleSubject) => {
            worksheet.addRow([
              department.name,
              group.name,
              daySchedule.dayOfWeek,
              scheduleSubject.roomNumber,
              scheduleSubject.orderNumber,
            ]);
          });
        });
      });
    });

    // Применение стилей к строкам данных
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) {
        // Пропускаем строки заголовков
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });

    // Автоматическое изменение ширины столбцов

    // Сохранение файла как буфера
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async saveDaySchedule(createScheduleDto: CreateScheduleDto) {
    console.log(createScheduleDto);

    const isGroupExists = await this.prisma.group.findFirst({
      where: { id: createScheduleDto.groupId },
    });

    if (!isGroupExists) throw new NotFoundException('Группа не найдена...');

    const isScheduleExists = await this.prisma.daySchedule.findFirst({
      where: {
        AND: [
          { dayOfWeek: createScheduleDto.dayOfWeek },
          { groupId: createScheduleDto.groupId },
        ],
      },
    });

    if (isScheduleExists) {
      await this.prisma.daySchedule.delete({
        where: {
          id: isScheduleExists.id,
        },
      });
    }

    const createdDaySchedule = await this.prisma.daySchedule.create({
      data: {
        dayOfWeek: createScheduleDto.dayOfWeek,
        Group: {
          connect: { id: createScheduleDto.groupId },
        },
      },
    });

    const filteredLessonItems = createScheduleDto.daySubjects.filter(
      (item) => item.subjectId !== '',
    );

    const conflictSubjects = await Promise.all(
      filteredLessonItems.map((subject) =>
        this.prisma.scheduleSubject.findMany({
          where: {
            DaySchedule: {
              dayOfWeek: createScheduleDto.dayOfWeek,
            },

            AND: [
              {
                orderNumber: subject.orderNumber,
              },
              {
                roomNumber: subject.roomNumber,
              },
            ],
          },
          include: {
            subject: true,
            DaySchedule: {
              include: {
                Group: true,
              },
            },
          },
        }),
      ),
    );

    const flattenedConflictSubjects = conflictSubjects.flat();

    await Promise.all(
      filteredLessonItems.map((item) =>
        this.prisma.scheduleSubject.create({
          data: {
            orderNumber: item.orderNumber,
            roomNumber: item.roomNumber,
            subject: {
              connect: { id: item.subjectId },
            },
            DaySchedule: {
              connect: { id: createdDaySchedule.id },
            },
          },
        }),
      ),
    );

    return flattenedConflictSubjects;
  }
}

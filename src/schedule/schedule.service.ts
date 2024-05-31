import { Header, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { group } from 'console';
import { User } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async confirmSchedule(id: string) {
    const schedule = await this.prisma.daySchedule.findFirst({
      where: { id },
      include: {
        scheduleSubjects: {
          include: {
            subject: true,
            ScheduleSubjectCabinet: {
              include: {
                cabinet: true,
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      throw new Error(`DaySchedule with id ${id} not found`);
    }

    // Iterate through each scheduleSubject in the DaySchedule
    for (const scheduleSubject of schedule.scheduleSubjects) {
      // Check if the subject is associated with the scheduleSubject
      if (scheduleSubject.subject) {
        // Fetch the current hoursPerGroup for the subject
        const subject = await this.prisma.subject.findUnique({
          where: { id: scheduleSubject.subjectId },
          select: { hoursPerGroup: true },
        });

        // Decrement the hoursPerGroup of the subject if it's greater than zero
        if (subject && subject.hoursPerGroup > 0) {
          await this.prisma.subject.update({
            where: { id: scheduleSubject.subjectId },
            data: { hoursPerGroup: { decrement: 1 } },
          });
        }
      }

      // Fetch the teacherSubject relation for the subject
      const teacherSubjects = await this.prisma.teacherSubject.findMany({
        where: { subjectId: scheduleSubject.subjectId },
      });

      for (const teacherSubject of teacherSubjects) {
        // Fetch the current totalHours for the teacher
        const teacher = await this.prisma.teacher.findUnique({
          where: { id: teacherSubject.teacherId },
          select: { totalHours: true },
        });

        // Decrement the totalHours of the teacher if it's greater than zero
        if (teacher && teacher.totalHours > 0) {
          await this.prisma.teacher.update({
            where: { id: teacherSubject.teacherId },
            data: { totalHours: { decrement: 1 } },
          });
        }
      }
    }
  }

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
          include: {
            ScheduleSubjectCabinet: {
              include: {
                cabinet: true,
              },
            },
          },
        },
      },
    });
  }

  async exportToExcel(day: string, location: string) {
    console.log(day, location);
    const data = await this.prisma.department.findMany({
      where: {
        location,
      },
      include: {
        groups: {
          include: {
            daySchedules: {
              where: {
                dayOfWeek: day,
              },
              include: {
                scheduleSubjects: {
                  include: {
                    subject: true,
                    ScheduleSubjectCabinet: {
                      include: {
                        cabinet: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(data);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(day);

    const timeSlots = [
      '8.00-8.45',
      '8.55-9.40',
      '9.50 – 10.35',
      '10.45 – 11.30',
      '11.40 – 12.25',
      '12.35 – 13.20',
      '13.30 – 14.15',
      '14.25 – 15.10',
      '15.20 – 16.05',
      '16.15 – 17.00',
      '17.10 – 17.55',
      '18.05 – 18.50',
    ];

    let rowNumber = 2;

    data.forEach((department) => {
      const departmentRow = worksheet.getRow(rowNumber);
      departmentRow.values = [department.name];
      departmentRow.font = { bold: true };
      departmentRow.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      departmentRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCCC' }, // Light grey background
      };
      rowNumber++;

      department.groups.forEach((group) => {
        const groupRow = worksheet.getRow(rowNumber);
        groupRow.values = [`Название группы: ${group.name}`];
        groupRow.font = { bold: true };
        groupRow.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };
        groupRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9EAD3' }, // Light green background
        };
        rowNumber++;

        const columns = [
          {
            header: '№ Зан',
            key: 'orderNumber',
            style: {
              font: { bold: true },
              alignment: { horizontal: 'center' as 'center' }, // Add type assertion
            },
          },
          {
            header: 'Время',
            key: 'time',
            style: {
              font: { bold: true },
              alignment: { horizontal: 'center' as 'center' }, // Add type assertion
            },
          },
          {
            header: 'Название группы',
            key: 'groupName',
            style: {
              font: { bold: true },
              alignment: { horizontal: 'center' as 'center' }, // Add type assertion
            },
          },
          {
            header: 'Кабинет',
            key: 'roomNumber',
            style: {
              font: { bold: true },
              alignment: { horizontal: 'center' as 'center' }, // Add type assertion
            },
          },
        ];

        worksheet.columns = columns;

        group.daySchedules.forEach((daySchedule) => {
          timeSlots.forEach((time, index) => {
            const subject = daySchedule.scheduleSubjects.find(
              (scheduleSubject) => scheduleSubject.orderNumber === index,
            );
            const row = worksheet.getRow(rowNumber + index);

            row.getCell('orderNumber').value = subject
              ? subject.orderNumber + 1
              : index + 1;
            row.getCell('time').value = time;
            row.getCell('groupName').value = subject
              ? subject.subject.name
              : '-';
            row.getCell('roomNumber').value = subject
              ? subject.ScheduleSubjectCabinet.map(
                  (cabinet) => cabinet.cabinet.roomNumber,
                ).join(', ')
              : '-';

            // Adding style to each cell
            row.eachCell((cell) => {
              cell.alignment = { vertical: 'middle', horizontal: 'center' };
              cell.font = { name: 'Arial', size: 12 };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFAFAD2' }, // Light yellow background
              };
            });
          });
          rowNumber += timeSlots.length;
        });

        rowNumber++;
      });

      rowNumber++;
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });
      }
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 2; // Add some padding to the width
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }

  async saveDaySchedule(createScheduleDto: CreateScheduleDto, user: User) {
    const isGroupExists = await this.prisma.group.findFirst({
      where: { id: createScheduleDto.groupId },
    });

    let isScheduleExists = await this.prisma.daySchedule.findFirst({
      where: {
        AND: [
          { dayOfWeek: createScheduleDto.dayOfWeek },
          { groupId: createScheduleDto.groupId },
        ],
      },
    });

    const filteredLessonItems = createScheduleDto.daySubjects.filter(
      (item) => item.subjectId !== '',
    );

    if (!isScheduleExists)
      isScheduleExists = await this.prisma.daySchedule.create({
        data: {
          dayOfWeek: createScheduleDto.dayOfWeek,

          Group: {
            connect: { id: createScheduleDto.groupId },
          },
        },
      });

    if (isScheduleExists && filteredLessonItems.length !== 0) {
      await this.prisma.scheduleSubject.deleteMany({
        where: {
          DaySchedule: { id: isScheduleExists.id },
        },
      });
    }

    await Promise.all(
      filteredLessonItems.map(async (item) => {
        const createdScheduleSubject = await this.prisma.scheduleSubject.create(
          {
            data: {
              orderNumber: item.orderNumber,
              subject: {
                connect: { id: item.subjectId },
              },
              DaySchedule: {
                connect: { id: isScheduleExists.id },
              },
            },
          },
        );

        await Promise.all(
          item.cabinets.map((cabinetId) =>
            this.prisma.scheduleSubjectCabinet.create({
              data: {
                scheduleSubject: {
                  connect: { id: createdScheduleSubject.id },
                },
                cabinet: {
                  connect: { id: cabinetId },
                },
              },
            }),
          ),
        );
        return createdScheduleSubject;
      }),
    );

    const createdSubjects = await this.prisma.scheduleSubject.findMany({
      where: {
        DaySchedule: { id: isScheduleExists.id },
      },
      include: {
        DaySchedule: true,
        ScheduleSubjectCabinet: {
          include: {
            cabinet: true,
          },
        },
      },
    });

    const conflicts = await Promise.all(
      createdSubjects.map((subject) =>
        this.prisma.scheduleSubject.findMany({
          where: {
            NOT: [{ DaySchedule: { id: subject.DaySchedule.id } }],
            AND: [
              { DaySchedule: { dayOfWeek: subject.DaySchedule.dayOfWeek } },
              { orderNumber: subject.orderNumber },
              {
                ScheduleSubjectCabinet: {
                  some: {
                    cabinetId: {
                      in: subject.ScheduleSubjectCabinet.map(
                        (cabinet) => cabinet.cabinetId,
                      ),
                    },
                  },
                },
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

    const flattenedConflictSubjects = conflicts.flat();

    // console.log(flattenedConflictSubjects);

    return flattenedConflictSubjects;
  }

  // data.forEach((department) => {
  //   department.groups.forEach((group) => {
  //     group.daySchedules.forEach((daySchedule) => {
  //       timeSlots.forEach((time, index) => {
  //         const subject = daySchedule.scheduleSubjects.find(
  //           (scheduleSubject) => scheduleSubject.orderNumber === index,
  //         );
  //         const rowData = {
  //           [`orderNumber${group.id}`]: subject
  //             ? subject.orderNumber + 1
  //             : index + 1,
  //           [`time${group.id}`]: time,
  //           [`subjectName${group.id}`]: subject ? subject.subject.name : '-',
  //           [`roomNumber${group.id}`]: subject ? subject.roomNumber : '-',
  //         };
  //         worksheet.addRow(rowData);
  //       });
  //     });
  //   });
  // });
}

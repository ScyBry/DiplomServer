import { Header, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { group } from 'console';

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

  // async exportToExcel(day: string) {
  //   const data = await this.prisma.department.findMany({
  //     include: {
  //       groups: {
  //         include: {
  //           daySchedules: {
  //             where: {
  //               dayOfWeek: day,
  //             },
  //             include: {
  //               scheduleSubjects: {
  //                 include: {
  //                   subject: true,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet(day);

  //   const timeSlots = [
  //     '8.00-8.45',
  //     '8.55-9.40',
  //     '9.50 – 10.35',
  //     '10.45 – 11.30',
  //     '11.40 – 12.25',
  //     '12.35 – 13.20',
  //     '13.30 – 14.15',
  //     '14.25 – 15.10',
  //     '15.20 – 16.05',
  //     '16.15 – 17.00',
  //     '17.10 – 17.55',
  //     '18.05 – 18.50',
  //   ];

  //   let columns = [];

  //   data.forEach((department) => {
  //     department.groups.forEach((group) => {
  //       const groupId = group.id;
  //       columns.push(
  //         {
  //           header: '№ Зан',
  //           key: `orderNumber${groupId}`,
  //           style: {
  //             font: { bold: true },
  //             alignment: { horizontal: 'center' },
  //           },
  //         },
  //         {
  //           header: 'Время',
  //           key: `time${groupId}`,
  //           style: {
  //             font: { bold: true },
  //             alignment: { horizontal: 'center' },
  //           },
  //         },
  //         {
  //           header: group.name,
  //           key: `subjectName${groupId}`,
  //           style: {
  //             font: { bold: true },
  //             alignment: { horizontal: 'center' },
  //           },
  //         },
  //         {
  //           header: 'Кабинет',
  //           key: `roomNumber${groupId}`,
  //           style: {
  //             font: { bold: true },
  //             alignment: { horizontal: 'center' },
  //           },
  //         },
  //       );
  //     });
  //   });

  //   worksheet.columns = columns;

  //   worksheet.getRow(1).font = { bold: true };
  //   worksheet.getRow(1).alignment = {
  //     vertical: 'middle',
  //     horizontal: 'center',
  //   };

  //   data.forEach((department) => {
  //     department.groups.forEach((group) => {
  //       group.daySchedules.forEach((daySchedule) => {
  //         timeSlots.forEach((time, index) => {
  //           const subject = daySchedule.scheduleSubjects.find(
  //             (scheduleSubject) => scheduleSubject.orderNumber === index,
  //           );
  //           const row = worksheet.getRow(index + 2);

  //           row.getCell(`orderNumber${group.id}`).value = subject
  //             ? subject.orderNumber + 1
  //             : index + 1;
  //           row.getCell(`time${group.id}`).value = time;
  //           row.getCell(`subjectName${group.id}`).value = subject
  //             ? subject.subject.name
  //             : '-';
  //           row.getCell(`roomNumber${group.id}`).value = subject
  //             ? subject.roomNumber
  //             : '-';
  //         });
  //       });
  //     });
  //   });

  //   worksheet.eachRow((row, rowNumber) => {
  //     if (rowNumber > 1) {
  //       row.eachCell((cell, colNumber) => {
  //         cell.border = {
  //           top: { style: 'thin' },
  //           left: { style: 'thin' },
  //           bottom: { style: 'thin' },
  //           right: { style: 'thin' },
  //         };
  //       });
  //     }
  //   });

  //   const buffer = await workbook.xlsx.writeBuffer();
  //   return buffer;
  // }

  async exportToExcel(day: string) {
    const data = await this.prisma.department.findMany({
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
                  },
                },
              },
            },
          },
        },
      },
    });

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
              ? subject.roomNumber
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

  async saveDaySchedule(createScheduleDto: CreateScheduleDto) {
    const isGroupExists = await this.prisma.group.findFirst({
      where: { id: createScheduleDto.groupId },
    });

    console.log(createScheduleDto);

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

    const result = await Promise.all(
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

    const conflictSubjects = await Promise.all(
      result.map((subject) =>
        this.prisma.scheduleSubject.findMany({
          where: {
            DaySchedule: {
              dayOfWeek: createScheduleDto.dayOfWeek,
              NOT: {
                id: subject.dayScheduleId,
              },
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

    console.log(flattenedConflictSubjects);

    return flattenedConflictSubjects;
  }
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

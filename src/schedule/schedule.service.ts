import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { daysToWeeks } from 'date-fns';

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
        scheduleSubjects: {
          orderBy: {
            orderNumber: 'asc',
          },
        },
      },
    });
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

    console.log(isScheduleExists);

    if (isScheduleExists) {
      await this.prisma.daySchedule.delete({
        where: {
          id: isScheduleExists.id,
        },
        include: {
          scheduleSubjects: true,
        },
      });
      console.log('Расписание удалено');
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

    const createdScheduleSubjects = await Promise.all(
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
  }
}

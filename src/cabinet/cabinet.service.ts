import { Injectable } from '@nestjs/common';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CabinetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCabinetDto: CreateCabinetDto[]) {
    console.log(createCabinetDto);

    const promises = createCabinetDto.map((cabinet) =>
      this.prisma.cabinet.create({
        data: {
          roomNumber: cabinet.roomNumber,
          location: cabinet.location,
        },
      }),
    );

    return Promise.all(promises);
  }

  async getAllCabinets() {
    return this.prisma.cabinet.findMany();
  }

  async getAllAvailableCabinets(
    day: string,
    location: string,
    orderNumber: string,
  ) {
    const availableCabinets = await this.prisma.cabinet.findMany({
      where: {
        location,
        NOT: {
          scheduleSubjects: {
            some: {
              scheduleSubject: {
                DaySchedule: {
                  dayOfWeek: day,
                },
                orderNumber: Number(orderNumber),
              },
            },
          },
        },
      },
    });
    return availableCabinets;
  }
}

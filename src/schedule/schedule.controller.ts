import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('getGroupSchedule')
  getAllGroupSchedule(@Query('id') id: string) {
    return this.scheduleService.getGroupsSchedule(id);
  }

  @Post('saveDaySchedule')
  saveDaySchedule(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.saveDaySchedule(createScheduleDto);
  }

  @Get('aboba')
  async exportToExcel(@Res() res) {
    try {
      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=day-schedules.xlsx',
      });
      const buffer = await this.scheduleService.exportToExcel();
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send('An error occurred while exporting the data to Excel');
    }
  }
}

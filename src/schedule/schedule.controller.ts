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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get('getGroupSchedule')
  getAllGroupSchedule(@Query('id') id: string) {
    return this.scheduleService.getGroupsSchedule(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saveDaySchedule')
  saveDaySchedule(@Body() createScheduleDto: CreateScheduleDto, @Req() req) {
    return this.scheduleService.saveDaySchedule(createScheduleDto, req.user);
  }

  @Post('confirmSchedule')
  confirmSchedule(@Query('id') id: string) {
    return this.scheduleService.confirmSchedule(id);
  }

  @Get('exportExcel')
  async exportToExcel(
    @Res() res,

    @Query('day') day: string,
    @Query('location') location: string,
  ) {
    try {
      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=day-schedules.xlsx',
      });
      const buffer = await this.scheduleService.exportToExcel(day, location);
      res.send(buffer);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send('An error occurred while exporting the data to Excel');
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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
}

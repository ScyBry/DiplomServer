import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CabinetService } from './cabinet.service';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cabinets')
export class CabinetController {
  constructor(private readonly cabinetService: CabinetService) {}

  @Post('createCabinet')
  createCabinet(@Body() createCabinetDto: CreateCabinetDto[]) {
    return this.cabinetService.create(createCabinetDto);
  }

  @Get('getAllCabinets')
  getAllCabinets() {
    return this.cabinetService.getAllCabinets();
  }

  @Get('findAvailableCabinets')
  findAvailableCabinets(
    @Query('day') day: string,
    @Query('location') location: string,
    @Query('orderNumber') orderNumber: string,
  ) {
    console.log(day, location, orderNumber);
    return this.cabinetService.getAllAvailableCabinets(
      day,
      location,
      orderNumber,
    );
  }
}

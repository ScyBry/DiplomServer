import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('createDepartment')
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get('getAllDepartments')
  getAllDepartments() {
    return this.departmentService.getAll();
  }

  @Get('getDepartmentById')
  getDepartmentById(@Query('id') id: string) {
    return this.departmentService.findOne(+id);
  }

  @Patch('updateDepartment')
  updateDepartment(
    @Query('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(+id, updateDepartmentDto);
  }

  @Delete('deleteDepartment')
  deleteDepartment(@Query('id') id: string) {
    return this.departmentService.delete(+id);
  }
}

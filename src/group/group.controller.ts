import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('createGroup')
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get('getAllGroups')
  findAll() {
    return this.groupService.findAll();
  }

  @Patch('updateGroup')
  update(@Query('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete('deleteGroup')
  deleteGroup(@Query('id') id: string) {
    return this.groupService.remove(id);
  }

  @Get('findOneGroup')
  findOneGroup(@Query('id') id: string) {
    return this.groupService.findOne(id);
  }
}

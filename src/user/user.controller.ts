import { Body, Controller, Delete, Get, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('findAll')
  findAll() {
    return this.userService.findAll();
  }

  @Patch('updateUser')
  updateUser(@Query('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete('deleteUser')
  deleteUser(@Query('id') id: string) {
    return this.userService.delete(id);
  }
}

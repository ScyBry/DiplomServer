import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  signUp(@Body() registerDto: RegisterUserDto) {
    console.log(registerDto);
    return this.userService.create(registerDto);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signIn(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('getProfile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}

import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RegisterUserDto } from '../auth/dto/create-auth.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(registerUserDto: RegisterUserDto) {
    if (registerUserDto.password !== registerUserDto.repeatPassword)
      throw new BadRequestException('Пароли не совпадают');

    const existUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerUserDto.email },
          { username: registerUserDto.username },
        ],
      },
    });

    if (existUser)
      throw new ConflictException(
        'Пользователь с таким именем пользователя или почтой уже существует',
      );

    const user = await this.prisma.user.create({
      data: {
        email: registerUserDto.email,
        username: registerUserDto.username,
        password: await argon2.hash(registerUserDto.password),
      },
    });

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    const { id, email, username, createdAt, updatedAt } = user;

    return {
      id,
      email,
      username,
      createdAt,
      updatedAt,
      token,
      statusCode: HttpStatus.CREATED,
    };
  }

  async delete(id: string) {
    const existUser = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!existUser) throw new NotFoundException('Пользователь не найден');

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findOne(id: string) {
    const existUser = await this.prisma.user.findFirst({
      where: { id },
    });

    if (!existUser) throw new NotFoundException('Пользователь не найден');

    return existUser;
  }
}

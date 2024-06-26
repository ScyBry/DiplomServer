import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { IUser } from '../types';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(emailOrUsername: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!user) throw new NotFoundException('Пользователь не найден');

    const passwordIsMatch = await argon2.verify(user.password, password);

    if (!passwordIsMatch)
      throw new UnauthorizedException('Данные не совпадают');

    return user;
  }

  async login(user: User) {
    const { id, username, email, isAdmin, createdAt, updatedAt } = user;

    return {
      id,
      email,
      username,
      isAdmin,
      createdAt,
      updatedAt,
      statusCode: HttpStatus.OK,
      token: this.jwtService.sign({ id, username, email, isAdmin }),
    };
  }
}

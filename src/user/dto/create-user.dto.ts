import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3, {
    message: 'Длина имени пользователя должна быть миниум 3 символа',
  })
  @MaxLength(100, {
    message: 'Длина имени пользователя не должна привышать 100 символов',
  })
  username: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть миниум 6 символов' })
  @MaxLength(100, { message: 'Пароль может быть максиум 100 символов' })
  password: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть миниум 6 символов' })
  @MaxLength(100, { message: 'Пароль может быть максиум 100 символов' })
  repeatPassword: string;

  isAdmin?: boolean;
}

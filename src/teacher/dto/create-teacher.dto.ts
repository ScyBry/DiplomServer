import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTeacherDto {
  @IsString({ message: 'Имя преподавателя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя преподавателя не может быть пустым' })
  firstName: string;

  @IsString({ message: 'Фамилия преподавателя должна быть строкой' })
  @IsNotEmpty({ message: 'Фамилия преподавателя не может быть пустой' })
  lastName: string;

  @IsString({ message: 'Отчество преподавателя должно быть строкой' })
  @IsNotEmpty({ message: 'Отчество преподавателя не может быть пустым' })
  surname: string;

  @IsNumber({}, { message: 'Общее количество часов должно быть числом' })
  @IsPositive({ message: 'Кол-во часов не может быть меньше 0' })
  @IsInt({ message: 'Кол-во часов должно быть целым числом' })
  totalHours: number;
}

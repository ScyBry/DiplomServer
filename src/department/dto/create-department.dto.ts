import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString({ message: 'Название отделения должно быть строкой' })
  @IsNotEmpty({ message: 'Название отделения не должно быть пустым' })
  name: string;

  @IsString({ message: 'Корпус должен быть строкой' })
  location: 'УПК' | 'ГЛВ';
}

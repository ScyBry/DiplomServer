import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString({ message: 'Название отделения должно быть строкой' })
  @IsNotEmpty({ message: 'Название отделения не должно быть пустым' })
  name: string;

  @IsNotEmpty({ message: 'Корпус не должен быть пустым' })
  @IsString({ message: 'Корпус должен быть строкой' })
  location: 'УПК' | 'ГЛВ';
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCabinetDto {
  @IsNotEmpty({ message: 'Номер комнат не может быть пустым' })
  @IsString({ message: 'Номер кабинета должен быть строкой' })
  roomNumber: string;

  @IsNotEmpty({ message: 'Корпус не может быть пустым' })
  @IsString({ message: 'Корпус кабинета должен быть строкой' })
  location: 'УПК' | 'ГЛВ';
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty({ message: 'Название предмета не может быть пустым' })
  @IsString({ message: 'Название предмета должно быть строкой' })
  name: string;

  @IsNumber({}, { message: 'Количество часов должно быть числом' })
  hoursPerGroup: number;

  @IsNotEmpty({ message: 'ID группы не может быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  groupId: string;
}

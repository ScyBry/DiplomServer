import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString({ message: 'Название предмета должно быть строкой' })
  @IsNotEmpty({ message: 'Название предмета не может быть пустым' })
  name: string;

  @IsNumber({}, { message: 'Количество часов должно быть числом' })
  hoursPerGroup: number;

  @IsString({ message: 'ID группы должен быть строкой' })
  @IsNotEmpty({ message: 'ID группы не может быть пустым' })
  groupId: string;
}

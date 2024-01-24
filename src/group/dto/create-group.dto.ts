import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty({ message: 'Название группы не должно быть пустым' })
  @IsString({ message: 'Название группы должно быть строкой' })
  name: string;

  @IsNotEmpty({ message: 'ID отделения не должно быть пустым' })
  departmentId: number;
}

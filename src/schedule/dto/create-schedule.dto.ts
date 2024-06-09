import { IsEnum, IsNotEmpty } from 'class-validator';
import { IScheduleSubject } from 'src/types';

export class CreateScheduleDto {
  @IsNotEmpty({ message: 'Id группы не может быть пустым' })
  groupId: string;

  @IsEnum(['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'], {
    message: 'Некорректный день недели',
  })
  dayOfWeek: 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ';
  daySubjects: IScheduleSubject[];
}

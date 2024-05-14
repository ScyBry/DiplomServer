import { IScheduleSubject } from 'src/types';

export class CreateScheduleDto {
  groupId: string;
  dayOfWeek: 'ПН' | 'ВТ' | 'СР' | 'ЧТ' | 'ПТ';
  daySubjects: IScheduleSubject[];
}

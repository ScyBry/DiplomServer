export interface IUser {
  id: string;
  email: string;
  username: string;
}

export interface IScheduleSubject {
  orderNumber: number;
  subjectId: string;
  cabinets: string[];
}

export interface IScheduleDay {
  groupId: string;
  dayScheduleId: string;
  daySubjects: IScheduleSubject[];
}

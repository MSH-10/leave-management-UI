import { v4 as uuidv4 } from 'uuid';

export class LeaveApplication {
  id: string = uuidv4();
  applicantUserId: string = uuidv4();
  managerId: string = uuidv4();
  startDate: Date = new Date();
  endDate: Date = new Date();
  returnDate: Date = new Date();
  numberOfDays: number = 0;
  generalComments?: string;
  createdDateTime?: Date | null;
  createdUserId?: string | null;
  modifiedDateTime?: Date | null;
  modifiedUserId?: string | null;
}
import { v4 as uuidv4 } from 'uuid';

export class User {
  id?: string = uuidv4();
  fullName: string = '';
  username: string = '';
  password: string = '';
  email: string = '';
  age: number = 0;
  managerId?: string | null;
  role: string = '';
  createdDateTime?: Date | null;
  createdUserId?: string | null;
  modifiedDateTime?: Date | null;
  modifiedUserId?: string | null;
}


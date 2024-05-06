import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../communication/environments';
import { User } from '../models/user';
import { API_ENDPOINTS } from '../../communication/endPoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  public getApplicants(): Observable<User[]> {
    return this.http.get<User[]>(`${Environment.baseUrl}/${API_ENDPOINTS.users}`);
  }
}

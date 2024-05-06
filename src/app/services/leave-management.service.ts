import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../communication/environments';
import { LeaveApplication } from '../models/leaveapplication';
import { API_ENDPOINTS } from '../../communication/endPoints';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagementService {
  applications: LeaveApplication[] = [];

  constructor(private http: HttpClient) {}

  submitLeaveApplication(
    leaveApp: LeaveApplication
  ): Observable<LeaveApplication[]> {
    return this.http.post<LeaveApplication[]>(
      `${Environment.baseUrl}/${API_ENDPOINTS.leaveApplications}`,
      leaveApp
    );
  }

  getLeaveApplications(): Observable<LeaveApplication[]> {
    return this.http.get<LeaveApplication[]>(
      `${Environment.baseUrl}/${API_ENDPOINTS.leaveApplications}`
    );
  }
}

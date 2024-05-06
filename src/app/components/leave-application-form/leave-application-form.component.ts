import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  NgForm,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

import { LeaveApplication } from '../../models/leaveapplication';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { LeaveManagementService } from '../../services/leave-management.service';

@Component({
  selector: 'app-leave-application-form',
  templateUrl: './leave-application-form.component.html',
  styleUrl: './leave-application-form.component.scss'
})
export class LeaveApplicationFormComponent {
    applicants: User[] = [];
    managers: User[] = [];
    messageVisible: boolean = false;
    minStartDate: Date;
    minEndDate: Date;
    minReturnDate: Date;
    
    applicationForm = new FormGroup({
      applicantUserId: new FormControl('', Validators.required),
      managerId: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      returnDate: new FormControl('', Validators.required),
      numberOfDays: new FormControl('', Validators.required),
      generalComments: new FormControl('', [Validators.required, Validators.maxLength(500)]),
    });
  
    constructor(
      private userService: UserService,
      private leaveAppService: LeaveManagementService,
      private formBuilder: FormBuilder
    ) {
      this.minStartDate = new Date();
      this.minEndDate = new Date();
      this.minReturnDate = new Date();
    }

    ngOnInit(): void {
      this.userService
        .getApplicants()
        .subscribe((result: User[]) => (this.applicants = result.filter(u=>u.role != "CEO")));
  
      this.userService
        .getApplicants()
        .subscribe((result: User[]) => (this.managers = result.filter(u=>u.role != "Employee")));
    }

    onStartDateChange() {
      var startDate = new Date(
        this.applicationForm.controls['startDate'].value
          ? this.applicationForm.controls['startDate'].value
          : ''
      );
  
      this.applicationForm.controls['endDate'].setValue('');
      this.applicationForm.controls['returnDate'].setValue('');
      this.minEndDate.setDate(startDate.getDate() + 1);
      this.minReturnDate.setDate(startDate.getDate() + 1);
    }
  
    onEndDateChange() {
      var endDate = new Date(
        this.applicationForm.controls['endDate'].value
          ? this.applicationForm.controls['endDate'].value
          : ''
      );
  
      var startDate = new Date(
        this.applicationForm.controls['startDate'].value
          ? this.applicationForm.controls['startDate'].value
          : ''
      );
  
      this.minReturnDate.setDate(endDate.getDate() + 1);
      let difference = endDate.getTime() - startDate.getTime();
      let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
      this.applicationForm.controls['numberOfDays'].setValue(
        TotalDays.toString()
      );
      this.applicationForm.controls['returnDate'].setValue('');
    }
    
    onApplicantChange(applicantUserId: string) {
      let applicant = this.applicants.find((a) => a.id?.toString() == applicantUserId);
      this.userService.getApplicants().subscribe((result: User[]) => {
        this.managers = result.filter((m) => m.id == applicant?.managerId);
      });
    }
  
    onCancel() {
      this.clearForm();
    }
    
    onSubmitForm() {
      if (this.applicationForm.status == 'VALID') 
      {
        let leaveApplication = new LeaveApplication();
        // Check if the value is not null or undefined before assigning
        if (this.applicationForm.value.applicantUserId !== null && this.applicationForm.value.applicantUserId !== undefined) {
            leaveApplication.applicantUserId = this.applicationForm.value.applicantUserId;
        }
        if (this.applicationForm.value.managerId !== null && this.applicationForm.value.managerId !== undefined) {
            leaveApplication.managerId = this.applicationForm.value.managerId;
        }
        
        leaveApplication.startDate = new Date(
          this.applicationForm.value.startDate
            ? this.applicationForm.value.startDate
            : ''
        );
        leaveApplication.endDate = new Date(
          this.applicationForm.value.endDate
            ? this.applicationForm.value.endDate
            : ''
        );
        leaveApplication.returnDate = new Date(
          this.applicationForm.value.returnDate
            ? this.applicationForm.value.returnDate
            : ''
        );
        leaveApplication.numberOfDays = Number(
          this.applicationForm.value.numberOfDays
        );
        leaveApplication.generalComments = this.applicationForm.value
          .generalComments
          ? this.applicationForm.value.generalComments
          : '';

          this.leaveAppService
          .submitLeaveApplication(leaveApplication)
          .subscribe((leaveApp: LeaveApplication[]) => {
            this.messageVisible = true;
            
            this.clearForm();
            // Hide the success message after 3 seconds
            setTimeout(() => {
              this.messageVisible = false;
            }, 3000);
          });
      }
      else {
        this.applicationForm.markAllAsTouched();
      }
      
    }
    clearForm() {
      this.applicationForm.reset();
      this.applicationForm.markAsPristine();
      this.applicationForm.markAsUntouched();
      this.applicationForm.updateValueAndValidity();
    }
  }

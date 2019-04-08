import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';

import { Moment } from 'src/app/shared/models/moment';

@Component({
  selector: 'app-admin-manage-moment',
  templateUrl: './admin-manage-moment.component.html',
  styleUrls: ['./admin-manage-moment.component.scss']
})
export class AdminManageMomentComponent implements OnInit {

  error = false;

  chosenMomentId: number;

  numberOfPages: number;
  currentPage: number;

  allMoments: Moment[] = [];
  currentMomentList: Moment[] = [];

  constructor(
    public ms: NgbModal,
    public as: AuthService,
    public ads: AdminService,
    public sb: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.ads.getAllMoments()
      .subscribe((response: HttpResponse<Moment[]>) => {
        this.allMoments = response.body;
        this.currentMomentList = this.allMoments.slice(0, 10);
        this.currentPage = 1;
        this.numberOfPages = this.allMoments.length !== 0 ? Math.floor((this.allMoments.length - 1) / 10) + 1 : 1;
      }, (error: HttpErrorResponse) => {
        console.error(error.status + ' ' + error.message);
        this.error = true;
      });
  }

  needPadding(value: number): boolean {
    if (value < 10 && value > 0) {
      return true;
    } else {
      return false;
    }
  }

  openDelete(content: any, momentId: number): void {
    this.chosenMomentId = momentId;
    this.ms.open(content);
  }

  deleteMoment(): void {
    this.ms.dismissAll();
    this.ads.deleteMoment(this.chosenMomentId)
      .subscribe((response: HttpResponse<string>) => {
        this.showSnackBarMessage('Moment successfully deleted', 'close', 2000);
        this.allMoments.forEach((moment: Moment, index: number, allMoments: Moment[]) => {
          if (moment.momentId === this.chosenMomentId) {
            allMoments.splice(index, 1);
          }
        });
        this.refreshMoments();
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.showSnackBarMessage('Moment not found', 'close', 2000);
        } else if (error.status === 417) {
          this.showSnackBarMessage('Session expired, please login again', 'close', 2000);
          setTimeout(() => {
            this.as.setKoalibeeId(0);
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 2500);
        } else {
          this.showSnackBarMessage('Unauthorized access', 'close', 2000);
          setTimeout(() => {
            this.as.setKoalibeeId(0);
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 2500);
        }
      });
  }

  refreshMoments() {
    this.currentMomentList = this.allMoments.slice(0, 10);
    this.currentPage = 1;
    this.numberOfPages = this.allMoments.length !== 0 ? Math.floor((this.allMoments.length - 1) / 10) + 1 : 1;
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  navPrev(): void {
    if (this.currentPage !== 1) {
      this.currentPage -= 1;
      this.currentMomentList = this.allMoments.slice((this.currentPage - 1) * 10, this.currentPage * 10);
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentMomentList = this.allMoments.slice((this.currentPage - 1) * 10, this.currentPage * 10);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { AdminService } from '../../core/services/admin.service';

import { Moment } from 'src/app/shared/models/moment';

@Component({
  selector: 'app-admin-manage-moment',
  templateUrl: './admin-manage-moment.component.html',
  styleUrls: ['./admin-manage-moment.component.scss']
})
export class AdminManageMomentComponent implements OnInit {

  error = false;

  allMoments: Moment[] = [];
  currentMomentList: Moment[] = [];

  constructor(
    public ads: AdminService
  ) { }

  ngOnInit() {
    this.ads.getAllMoments()
      .subscribe((response: HttpResponse<Moment[]>) => {
        this.allMoments = response.body;
        this.currentMomentList = this.allMoments.slice(0, 10);
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

  deleteMoment(momentId: number): void {
    console.log('deleting moment #' + momentId);
  }

  navPrev(): void {
    //
  }

  navNext(): void {
    //
  }

}

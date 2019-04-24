import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Moment } from 'src/app/shared/models/moment';

@Component({
  selector: 'app-koalibee-home',
  templateUrl: './koalibee-home.component.html',
  styleUrls: ['./koalibee-home.component.scss']
})
export class KoalibeeHomeComponent implements OnInit {

  MAX_CHAR_COUNT = 60;
  MAX_MOM_COUNT = 3;

  momentsToggled = false;

  numberOfPages: number;
  currentPage: number;

  moments: Moment[] = [];
  currentMoments: Moment[] = [];
  newMoment = '';

  constructor(
    public http: HttpClient,
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.loadMoments();
  }

  toggleMoments(): void {
    this.momentsToggled = !this.momentsToggled;
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  loadMoments(): void {
    this.http.get<Moment[]>(AuthService.baseUrl + 'moment/' + 'get/' + 'all')
      .subscribe((response: Moment[]) => {
        this.moments = response.slice(0, 15);
        this.moments.sort((a: any, b: any) => {
          return a.postDate.year === b.postDate.year ?
            a.postDate.monthValue === b.postDate.monthValue ?
              a.postDate.dayOfMonth === b.postDate.dayOfMonth ? 0 :
                b.postDate.dayOfMonth - a.postDate.dayOfMonth :
              b.postDate.monthValue - a.postDate.monthValue :
            b.postDate.year - a.postDate.year;
        });
        this.currentMoments = this.moments.slice(0, this.MAX_MOM_COUNT);
        this.currentPage = 1;
        this.numberOfPages = this.moments.length !== 0 ? Math.floor((this.moments.length - 1) / this.MAX_MOM_COUNT) + 1 : 1;
      });
  }

  formatDate(dateObject: any): string {
    let year = dateObject.year.toString();
    let month = dateObject.monthValue.toString();
    let day = dateObject.dayOfMonth.toString();
    if (month.length === 1) {
      month = '0' + month;
    }
    if (day.length === 1) {
      day = '0' + day;
    }
    return `${year}-${month}-${day}`;
  }

  lengthExceeded(): boolean {
    return this.newMoment.length > 60;
  }

  navPrev(): void {
    if (this.currentPage !== 1) {
      this.currentPage -= 1;
      this.currentMoments = this.moments.slice((this.currentPage - 1) * this.MAX_MOM_COUNT, this.currentPage * this.MAX_MOM_COUNT);
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentMoments = this.moments.slice((this.currentPage - 1) * this.MAX_MOM_COUNT, this.currentPage * this.MAX_MOM_COUNT);
    }
  }

  trimMoment(moment: string): string {
    if (moment.length > this.MAX_CHAR_COUNT) {
      return moment.substring(0, this.MAX_CHAR_COUNT + 1) + '...';
    } else {
      return moment;
    }
  }

  postMoment(): void {
    // Check for empty post
    if (this.newMoment.trim().length < 1) {
      this.showSnackBarMessage('Moment content is empty', 'close', 2000);
      return;
    }
    let momentData = {};
    momentData['postComment'] = this.newMoment;
    this.ks.postMoment(JSON.stringify(momentData))
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 201) {
          this.showSnackBarMessage('Your moment has been posted', 'close', 2500);
          this.loadMoments();
          this.newMoment = '';
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage('Unable to post new moment', 'close', 2000);
        } else {
          this.showSnackBarMessage('Invalid user session or expired session', 'close', 2000);
          this.as.clearData();
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2500);
        }
      });
  }

}

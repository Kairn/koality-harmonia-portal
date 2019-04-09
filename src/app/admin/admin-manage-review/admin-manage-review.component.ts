import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';
import { Review } from 'src/app/shared/models/review';

@Component({
  selector: 'app-admin-manage-review',
  templateUrl: './admin-manage-review.component.html',
  styleUrls: ['./admin-manage-review.component.scss']
})
export class AdminManageReviewComponent implements OnInit {

  error = false;

  chosenReviewId: number;

  numberOfPages: number;
  currentPage: number;

  currentSort: string;

  allReviews: Review[] = [];
  currentReviewList: Review[] = [];

  constructor(
    public ms: NgbModal,
    public as: AuthService,
    public ads: AdminService,
    public sb: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.ads.getAllReviews()
      .subscribe((response: HttpResponse<Review[]>) => {
        this.allReviews = response.body;
        this.currentReviewList = this.allReviews.slice(0, 10);
        this.currentPage = 1;
        this.numberOfPages = this.allReviews.length !== 0 ? Math.floor((this.allReviews.length - 1) / 10) + 1 : 1;
        this.currentSort = 'id';
      }, (error: HttpErrorResponse) => {
        console.error(error.status + ' ' + error.message);
        this.error = true;
      });
  }

  openDelete(content: any, reviewId: number): void {
    this.chosenReviewId = reviewId;
    this.ms.open(content);
  }

  deleteReview(): void {
    //
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
      this.currentReviewList = this.allReviews.slice((this.currentPage - 1) * 10, this.currentPage * 10);
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentReviewList = this.allReviews.slice((this.currentPage - 1) * 10, this.currentPage * 10);
    }
  }

  refreshReviews() {
    this.currentReviewList = this.allReviews.slice(0, 10);
    this.currentPage = 1;
    this.numberOfPages = this.allReviews.length !== 0 ? Math.floor((this.allReviews.length - 1) / 10) + 1 : 1;
  }

  sortById(): void {
    //
  }

  sortByAlbum(): void {
    //
  }

  sortByKoalibee(): void {
    //
  }

}

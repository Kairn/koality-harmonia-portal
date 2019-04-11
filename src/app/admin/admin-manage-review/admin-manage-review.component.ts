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
        if (error.status === 417) {
          this.as.setKoalibeeId(0);
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  openDelete(content: any, reviewId: number): void {
    this.chosenReviewId = reviewId;
    this.ms.open(content);
  }

  deleteReview(): void {
    this.ms.dismissAll();
    this.ads.deleteReview(this.chosenReviewId)
      .subscribe((response: HttpResponse<string>) => {
        this.showSnackBarMessage('Review successfully deleted', 'close', 2000);
        this.allReviews.forEach((review: Review, index: number, allReviews: Review[]) => {
          if (review.reviewId === this.chosenReviewId) {
            allReviews.splice(index, 1);
          }
        });
        this.refreshReviews();
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.showSnackBarMessage('Review not found', 'close', 2000);
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
    if (this.currentSort === 'id') {
      this.allReviews.reverse();
    } else {
      this.allReviews.sort((a: Review, b: Review): number => {
        return a.reviewId - b.reviewId;
      });
      this.currentSort = 'id';
    }
    this.refreshReviews();
  }

  sortByAlbum(): void {
    if (this.currentSort === 'album') {
      this.allReviews.reverse();
    } else {
      this.allReviews.sort((a: Review, b: Review): number => {
        return a.albumName.localeCompare(b.albumName);
      });
      this.currentSort = 'album';
    }
    this.refreshReviews();
  }

  sortByKoalibee(): void {
    if (this.currentSort === 'koalibee') {
      this.allReviews.reverse();
    } else {
      this.allReviews.sort((a: Review, b: Review): number => {
        return a.koalibeeName.localeCompare(b.koalibeeName);
      });
      this.currentSort = 'koalibee';
    }
    this.refreshReviews();
  }

}

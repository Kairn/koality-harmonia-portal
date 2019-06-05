import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';

@Component({
  selector: 'app-koalibee-inventory',
  templateUrl: './koalibee-inventory.component.html',
  styleUrls: ['./koalibee-inventory.component.scss']
})
export class KoalibeeInventoryComponent implements OnInit {

  currentAlbumList: Album[];

  ALBUMS_PER_PAGE = 3;
  numberOfPages: number;
  currentPage: number;
  hasAlbum = false;
  ready = false;

  rateAlbumId: number;
  rating = 5;
  comment = '';

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public ms: NgbModal,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  bgReady(): any {
    return this.ks.albumBinder;
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    if (duration === -1) {
      this.sb.open(
        message,
        action
      );
      return;
    }
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  loadInventory(): boolean {
    if (this.currentAlbumList) {
      return true;
    }
    if (this.ks.albumBinder) {
      this.currentAlbumList = this.ks.albumBinder.slice(0, this.ALBUMS_PER_PAGE);
      this.currentPage = 1;
      this.numberOfPages = this.ks.albumBinder.length !== 0 ? Math.floor((this.ks.albumBinder.length - 1) / this.ALBUMS_PER_PAGE) + 1 : 1;
      if (this.ks.albumBinder.length > 0) {
        this.hasAlbum = true;
      } else {
        this.hasAlbum = false;
      }
      this.ready = true;
      return true;
    } else {
      return false;
    }
  }

  navPrev(): void {
    if (this.currentPage !== 1) {
      this.currentPage -= 1;
      this.currentAlbumList = this.ks.albumBinder.slice(
        (this.currentPage - 1) * this.ALBUMS_PER_PAGE, this.currentPage * this.ALBUMS_PER_PAGE
      );
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentAlbumList = this.ks.albumBinder.slice(
        (this.currentPage - 1) * this.ALBUMS_PER_PAGE, this.currentPage * this.ALBUMS_PER_PAGE
      );
    }
  }

  openReview(albumId: number, content: any): void {
    this.rateAlbumId = albumId;
    this.ms.open(content, {
      beforeDismiss: (): boolean => {
        this.clearModal();
        return true;
      }
    });
  }

  clearModal(): void {
    this.rateAlbumId = 0;
    this.rating = 5;
    this.comment = '';
  }

  reviewValid(): boolean {
    if (this.rateAlbumId > 0) {
      if (this.comment && this.comment.length > 0) {
        return true;
      }
    }
    return false;
  }

  reviewSubmit(): void {
    if (!this.reviewValid() || !this.rateAlbumId) {
      return;
    }
    let reviewData: any = {};
    reviewData.rating = this.rating;
    reviewData.reviewComment = this.comment;
    this.ks.postAlbumReview(this.rateAlbumId, JSON.stringify(reviewData))
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 201) {
          this.ks.loadKoalibeeData();
          this.showSnackBarMessage('Your review has been submitted', 'close', 2500);
          this.ms.dismissAll();
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage(`Post failed, review already exists or invalid content`, 'close', 2000);
        } else {
          this.ks.clearData();
          this.as.clearData();
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  playAlbum(album: Album): void {
    this.ks.albumPlaying = album;
    this.router.navigate(['../player'], { relativeTo: this.route });
  }

}

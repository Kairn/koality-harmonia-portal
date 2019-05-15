import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Track } from 'src/app/shared/models/track';

@Component({
  selector: 'app-koalibee-inventory',
  templateUrl: './koalibee-inventory.component.html',
  styleUrls: ['./koalibee-inventory.component.scss']
})
export class KoalibeeInventoryComponent implements OnInit {

  allAlbums: Album[];
  currentAlbumList: Album[];

  ALBUMS_PER_PAGE = 4;
  numberOfPages: number;
  currentPage: number;
  hasAlbum = false;
  ready = false;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public ms: NgbModal,
    public router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadInventory();
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

  loadInventory(): void {
    this.ks.getInventory()
      .subscribe((response: HttpResponse<Album[]>) => {
        if (response.status === 200) {
          this.allAlbums = response.body;
          this.allAlbums.sort((a: Album, b: Album) => {
            return a.albumName.localeCompare(b.albumName);
          });
          this.currentAlbumList = this.allAlbums.slice(0, this.ALBUMS_PER_PAGE);
          this.currentPage = 1;
          this.numberOfPages = this.allAlbums.length !== 0 ? Math.floor((this.allAlbums.length - 1) / this.ALBUMS_PER_PAGE) + 1 : 1;
          if (this.allAlbums.length > 0) {
            this.hasAlbum = true;
          } else {
            this.hasAlbum = false;
          }
          this.ready = true;
        }
      }, (error: HttpErrorResponse) => {
        this.as.clearData();
        this.ks.clearData();
        localStorage.clear();
        this.router.navigate(['/login']);
      });
  }

  navPrev(): void {
    if (this.currentPage !== 1) {
      this.currentPage -= 1;
      this.currentAlbumList = this.allAlbums.slice((this.currentPage - 1) * this.ALBUMS_PER_PAGE, this.currentPage * this.ALBUMS_PER_PAGE);
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentAlbumList = this.allAlbums.slice((this.currentPage - 1) * this.ALBUMS_PER_PAGE, this.currentPage * this.ALBUMS_PER_PAGE);
    }
  }

  openReview(albumId: number, content: any): void {
    //
  }

  reviewSubmit(): void {
    //
  }

  playAlbum(album: Album): void {
    //
  }

}

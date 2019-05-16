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

  currentAlbumList: Album[];

  ALBUMS_PER_PAGE = 3;
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
    //
  }

  reviewSubmit(): void {
    //
  }

  playAlbum(album: Album): void {
    //
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Genre } from 'src/app/shared/models/genre';

@Component({
  selector: 'app-koalibee-manage-album',
  templateUrl: './koalibee-manage-album.component.html',
  styleUrls: ['./koalibee-manage-album.component.scss']
})
export class KoalibeeManageAlbumComponent implements OnInit {

  ALL_GENRES: Genre[];
  albumPendingDelete: Album;
  allAlbums: Album[];
  currentAlbumList: Album[];

  ALBUMS_PER_PAGE = 3;
  numberOfPages: number;
  currentPage: number;
  hasWork: boolean;
  hasOneWork: boolean;

  albumCreateForm: FormGroup;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public ms: NgbModal,
    public router: Router,
    public fb: FormBuilder
  ) {
    this.ALL_GENRES = [];
    Genre.generEnumeration.forEach((name: string, index: number) => {
      this.ALL_GENRES.push(new Genre(index + 1, name));
    });

    this.albumCreateForm = this.fb.group({
      albumName: this.fb.control({ value: null, disabled: false }, Validators.required),
      artist: this.fb.control({ value: null, disabled: false }, Validators.required),
      genre: this.fb.control({ value: null, disabled: false }, Validators.required)
    });
  }

  ngOnInit() {
    this.ks.getUnpublished()
      .subscribe((response: HttpResponse<Album[]>) => {
        this.allAlbums = response.body;
        this.currentAlbumList = this.allAlbums.slice(0, this.ALBUMS_PER_PAGE);
        this.currentPage = 1;
        this.numberOfPages = this.allAlbums.length !== 0 ? Math.floor((this.allAlbums.length - 1) / this.ALBUMS_PER_PAGE) + 1 : 1;
        if (this.allAlbums.length > 0) {
          this.hasWork = true;
          if (this.allAlbums.length === 1) {
            this.hasOneWork = true;
          }
        } else {
          this.hasWork = false;
        }
      }, (error: HttpErrorResponse) => {
        console.error(error.status + ' ' + error.message);
        this.as.clearData();
        this.ks.clearData();
        localStorage.clear();
        this.router.navigate(['/login']);
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
      this.currentAlbumList = this.allAlbums.slice((this.currentPage - 1) * this.ALBUMS_PER_PAGE, this.currentPage * this.ALBUMS_PER_PAGE);
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentAlbumList = this.allAlbums.slice((this.currentPage - 1) * this.ALBUMS_PER_PAGE, this.currentPage * this.ALBUMS_PER_PAGE);
    }
  }

  refreshAlbums() {
    this.currentAlbumList = this.allAlbums.slice(0, this.ALBUMS_PER_PAGE);
    this.currentPage = 1;
    this.numberOfPages = this.allAlbums.length !== 0 ? Math.floor((this.allAlbums.length - 1) / this.ALBUMS_PER_PAGE) + 1 : 1;
  }

  openDelete(content: any, album: Album): void {
    this.albumPendingDelete = album;
    this.ms.open(content);
  }

  deleteAlbum(): void {
    console.log(this.albumPendingDelete);
  }

  createAlbumSubmit(): void {
    console.log(this.albumCreateForm);
  }

}

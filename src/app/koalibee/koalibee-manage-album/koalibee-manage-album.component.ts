import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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

  ALBUMS_PER_PAGE = 1;
  numberOfPages: number;
  currentPage: number;
  hasWork = false;
  ready = false;

  albumCreateForm: FormGroup;

  @ViewChild('acf', { static: true }) acForm: NgForm;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public ms: NgbModal,
    public router: Router,
    public route: ActivatedRoute,
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
    this.loadUnfinished();
    // this.getDummyAlbums(0);
  }

  // Method for generating testing dummy albums
  getDummyAlbums(amount: number) {
    this.allAlbums = [];
    if (amount > this.ALBUMS_PER_PAGE) {
      amount = this.ALBUMS_PER_PAGE;
    }
    if (amount > 0) {
      for (let i = 0; i < amount; ++i) {
        this.allAlbums.push(new Album('dummy', 'dummy', 1, '??'));
      }
    }
    this.refreshAlbums();
    this.ready = true;
  }

  loadUnfinished(): void {
    this.ks.getUnpublished()
      .subscribe((response: HttpResponse<Album[]>) => {
        this.allAlbums = response.body;
        this.currentAlbumList = this.allAlbums.slice(0, this.ALBUMS_PER_PAGE);
        this.currentPage = 1;
        this.numberOfPages = this.allAlbums.length !== 0 ? Math.floor((this.allAlbums.length - 1) / this.ALBUMS_PER_PAGE) + 1 : 1;
        if (this.allAlbums.length > 0) {
          this.hasWork = true;
        } else {
          this.hasWork = false;
        }
        this.ready = true;
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
    if (this.allAlbums.length > 0) {
      this.hasWork = true;
    } else {
      this.hasWork = false;
    }
    this.currentAlbumList = this.allAlbums.slice(0, this.ALBUMS_PER_PAGE);
    this.currentPage = 1;
    this.numberOfPages = this.allAlbums.length !== 0 ? Math.floor((this.allAlbums.length - 1) / this.ALBUMS_PER_PAGE) + 1 : 1;
  }

  openDelete(content: any, album: Album): void {
    this.albumPendingDelete = album;
    this.ms.open(content);
  }

  deleteAlbum(): void {
    this.ks.deleteUnfinishedAlbum(this.albumPendingDelete.albumId)
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 200) {
          this.ms.dismissAll();
          this.showSnackBarMessage('Album has been deleted', 'close', 2500);
          this.allAlbums.forEach((album: Album, index: number) => {
            if (album.albumId === this.albumPendingDelete.albumId) {
              this.allAlbums.splice(index, index + 1);
              return;
            }
          });
          this.refreshAlbums();
          this.albumPendingDelete = null;
        }
      }, (error: HttpErrorResponse) => {
        this.ms.dismissAll();
        this.albumPendingDelete = null;
        if (error.status === 422) {
          this.showSnackBarMessage('Failed to delete album, please verify ID and try again', 'close', 2000);
        } else {
          this.showSnackBarMessage('Access denied or session expired', 'close', 1500);
          setTimeout(() => {
            this.as.clearData();
            this.ks.clearData();
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 1800);
        }
      });
  }

  createAlbumSubmit(): void {
    if (this.albumCreateForm.invalid) {
      return;
    }
    let albumData = this.albumCreateForm.value;
    albumData.genreId = albumData.genre;
    this.ks.createNewAlbum(JSON.stringify(albumData))
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 201) {
          this.acForm.resetForm();
          this.showSnackBarMessage('Album created successfully', 'close', 2500);
          this.loadUnfinished();
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage('Failed to create album, please report an issue', 'close', 2000);
        } else {
          this.showSnackBarMessage('Access denied or session expired', 'close', 1500);
          setTimeout(() => {
            this.as.clearData();
            this.ks.clearData();
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 1800);
        }
      });
  }

  openAlbumEdit(album: Album): void {
    this.ks.setAlbumInMaking(album);
    this.router.navigate(['../edit-album'], { relativeTo: this.route });
  }

}

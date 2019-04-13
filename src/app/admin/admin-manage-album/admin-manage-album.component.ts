import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';

import { Album } from '../../shared/models/album';

@Component({
  selector: 'app-admin-manage-album',
  templateUrl: './admin-manage-album.component.html',
  styleUrls: ['./admin-manage-album.component.scss']
})
export class AdminManageAlbumComponent implements OnInit {

  error: true;

  chosenAlbumId: number;

  numberOfPages: number;
  currentPage: number;

  currentSort: string;

  allAlbums: Album[];
  currentAlbumList: Album[];

  constructor(
    public ms: NgbModal,
    public as: AuthService,
    public ads: AdminService,
    public sb: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.ads.getAllAlbums()
      .subscribe((response: HttpResponse<Album[]>) => {
        this.allAlbums = response.body;
        this.currentAlbumList = this.allAlbums.slice(0, 4);
        this.currentPage = 1;
        this.numberOfPages = this.allAlbums.length !== 0 ? Math.floor((this.allAlbums.length - 1) / 4) + 1 : 1;
        this.sortById();
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

  openDelete(content: any, albumId: number): void {
    this.chosenAlbumId = albumId;
    this.ms.open(content);
  }

  deleteAlbum(): void {
    this.ms.dismissAll();
    this.ads.deleteAlbum(this.chosenAlbumId)
      .subscribe((response: HttpResponse<string>) => {
        this.showSnackBarMessage('Album successfully deleted', 'close', 2000);
        this.allAlbums.forEach((album: Album, index: number, allAlbums: Album[]) => {
          if (album.albumId === this.chosenAlbumId) {
            allAlbums.splice(index, 1);
          }
        });
        this.refreshAlbums();
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.showSnackBarMessage('Album not found', 'close', 2000);
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
      this.currentAlbumList = this.allAlbums.slice((this.currentPage - 1) * 4, this.currentPage * 4);
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentAlbumList = this.allAlbums.slice((this.currentPage - 1) * 4, this.currentPage * 4);
    }
  }

  refreshAlbums() {
    this.currentAlbumList = this.allAlbums.slice(0, 4);
    this.currentPage = 1;
    this.numberOfPages = this.allAlbums.length !== 0 ? Math.floor((this.allAlbums.length - 1) / 4) + 1 : 1;
  }

  sortById(): void {
    if (this.currentSort === 'id') {
      this.allAlbums.reverse();
    } else {
      this.allAlbums.sort((a: Album, b: Album) => {
        return a.albumId - b.albumId;
      });
      this.currentSort = 'id';
    }
    this.refreshAlbums();
  }

  sortByAlbum(): void {
    if (this.currentSort === 'album') {
      this.allAlbums.reverse();
    } else {
      this.allAlbums.sort((a: Album, b: Album) => {
        return a.albumName.localeCompare(b.albumName);
      });
      this.currentSort = 'album';
    }
    this.refreshAlbums();
  }

}

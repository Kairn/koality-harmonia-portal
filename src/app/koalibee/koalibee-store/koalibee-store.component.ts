import { Component, OnInit, ViewChildren, QueryList, AfterContentInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSlideToggle, MatSlideToggleChange } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Genre } from 'src/app/shared/models/genre';

@Component({
  selector: 'app-koalibee-store',
  templateUrl: './koalibee-store.component.html',
  styleUrls: ['./koalibee-store.component.scss']
})
export class KoalibeeStoreComponent implements OnInit, AfterViewInit {

  allAlbums: Album[];
  currentAlbumList: Album[];

  ALBUMS_PER_PAGE = 3;
  numberOfPages: number;
  currentPage: number;

  maxPrice = 999999;
  minPrice = 0;
  includedGenres: Genre[];

  loadDots: number[];
  loadInterval: any;

  @ViewChildren(MatSlideToggle) togglers: QueryList<MatSlideToggle>;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public ms: NgbModal,
    public router: Router
  ) {
    this.includedGenres = [];
    Genre.generEnumeration.forEach((name: string, index: number) => {
      this.includedGenres.push(new Genre(index + 1, name));
    });

    this.loadDots = [];
    this.loadInterval = setInterval(() => {
      this.updateDots();
    }, 1000);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.togglers.changes
      .subscribe((children: QueryList<MatSlideToggle>) => {
        children.forEach((toggler: MatSlideToggle) => {
          toggler.change
            .subscribe((change: MatSlideToggleChange) => {
              //
            });
        });
      });
  }

  ready(): boolean {
    if (this.ks.albumCollection) {
      if (this.ks.albumBinder) {
        return true;
      }
    }
    return false;
  }

  loadContent(): boolean {
    if (this.allAlbums) {
      return true;
    }
    this.allAlbums = this.ks.albumCollection;
    this.currentAlbumList = this.allAlbums.slice(0, this.ALBUMS_PER_PAGE);
    this.currentPage = 1;
    this.numberOfPages = this.allAlbums.length !== 0 ? Math.floor((this.allAlbums.length - 1) / this.ALBUMS_PER_PAGE) + 1 : 1;
    clearInterval(this.loadInterval);
    return true;
  }

  updateDots(): void {
    //
  }

  openGenreFilter(content: any): void {
    this.ms.open(content);
  }

  openPriceFilter(content: any): void {
    this.ms.open(content);
  }

  applyFilter(): void {
    this.ms.dismissAll();
  }

  isOwned(albumId: number): boolean {
    for (let i = 0; i < this.ks.albumBinder.length; ++i) {
      if (this.ks.albumBinder[i].albumId === albumId) {
        return true;
      }
    }
    return false;
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

}

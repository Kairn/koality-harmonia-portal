import { Component, OnInit, ViewChildren, QueryList, AfterContentInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSlideToggle, MatSlideToggleChange, MatSelectionList, MatSelectionListChange, MatListOption } from '@angular/material';
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
  _max: number;
  minPrice = 0;
  _min: number;
  allGenres: Genre[];
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
    this._min = this.minPrice;
    this._max = this.maxPrice;

    this.allGenres = [];
    Genre.generEnumeration.forEach((name: string, index: number) => {
      this.allGenres.push(new Genre(index + 1, name));
    });
    this.includedGenres = this.allGenres;

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

  isIncluded(genre: Genre) {
    for (let i = 0; i < this.includedGenres.length; ++i) {
      if (this.includedGenres[i].genreId === genre.genreId) {
        return true;
      }
    }
    return false;
  }

  filterGenre(genreList: MatSelectionList) {
    this.includedGenres = [];
    genreList.selectedOptions.selected.forEach((option: MatListOption) => {
      if (option.selected) {
        let genreId = parseInt(option.value, 10);
        this.includedGenres.push(this.allGenres[genreId - 1]);
      }
    });
    console.log(this.includedGenres);
    this.ms.dismissAll();
  }

  invert(genreList: MatSelectionList) {
    genreList.options.forEach((option: MatListOption) => {
      option.toggle();
    });
  }

  selectAll(genreList: MatSelectionList) {
    genreList.selectAll();
  }

  openPriceFilter(content: any): void {
    this._min = this.minPrice;
    this._max = this.maxPrice;
    this.ms.open(content);
  }

  priceValid(): boolean {
    if (this._min === null || this._max === null) {
      return false;
    }
    if (this._min < 0) {
      return false;
    }
    if (this._max < this._min) {
      return false;
    }
    return true;
  }

  resetPrice(): void {
    this._min = 0;
    this._max = 999999;
  }

  filterPrice(): void {
    if (!this.priceValid()) {
      return;
    }
    this.maxPrice = this._max;
    this.minPrice = this._min;
    this.ms.dismissAll();
  }

  free() {
    this._min = 0;
    this._max = 0;
  }

  applyFilter(): void {
    //
  }

  isOwned(albumId: number): boolean {
    for (let i = 0; i < this.ks.albumBinder.length; ++i) {
      if (this.ks.albumBinder[i].albumId === albumId) {
        return true;
      }
    }
    return false;
  }

  viewAlbum(album: Album): void {
    //
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

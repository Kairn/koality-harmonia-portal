import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Track } from 'src/app/shared/models/track';
import { Review } from 'src/app/shared/models/review';

@Component({
  selector: 'app-koalibee-album-detail',
  templateUrl: './koalibee-album-detail.component.html',
  styleUrls: ['./koalibee-album-detail.component.scss']
})
export class KoalibeeAlbumDetailComponent implements OnInit {

  loadDots: number[];
  loadInterval: any;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public ms: NgbModal,
    public router: Router,
  ) {
    this.loadDots = [];
    this.loadInterval = setInterval(() => {
      this.updateDots();
    }, 1000);
  }

  ngOnInit() {
  }

  updateDots(): void {
    if (this.loadDots.length >= 6) {
      this.loadDots = [];
    } else {
      this.loadDots.push(0);
    }
  }

  ready(): boolean {
    return true;
  }

  purchaseAlbum(): void {
    //
  }

  promoteAlbum(): void {
    //
  }

}

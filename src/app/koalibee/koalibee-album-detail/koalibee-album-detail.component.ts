import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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

  album: Album;
  tracks: Track[];

  loadDots: number[];
  loadInterval: any;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public ms: NgbModal,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.loadDots = [];
    this.loadInterval = setInterval(() => {
      this.updateDots();
    }, 1000);
  }

  ngOnInit() {
    this.loadAlbumData();
    this.loadTracks();
  }

  updateDots(): void {
    if (this.loadDots.length >= 6) {
      this.loadDots = [];
    } else {
      this.loadDots.push(0);
    }
  }

  ready(): boolean {
    if (this.album) {
      return true;
    } else {
      return false;
    }
  }

  loadAlbumData(): void {
    this.ks.getAlbumById(parseInt(localStorage.getItem('Album-Shopping'), 10))
      .subscribe((response: HttpResponse<Album>) => {
        if (response.status === 200) {
          this.album = response.body;
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.router.navigate(['../store'], { relativeTo: this.route });
        }
        if (error.status === 401) {
          this.ks.clearData();
          this.as.clearData();
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  loadTracks(): void {
    this.ks.getTracksInAlbum((parseInt(localStorage.getItem('Album-Shopping'), 10)))
      .subscribe((response: HttpResponse<Track[]>) => {
        if (response.status === 200) {
          this.tracks = response.body;
        } else if (response.status === 204) {
          this.tracks = [];
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.tracks = [];
        } else {
          this.ks.clearData();
          this.as.clearData();
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  getTotalTime(): string {
    if (!this.tracks) {
      return '00:00:00';
    }
    let total = 0;
    let hour: number;
    let minute: number;
    let second: number;
    this.tracks.forEach((track: Track) => {
      total += track.trackLength;
    });
    if (total < 3600) {
      hour = 0;
    } else {
      hour = Math.floor(total / 3600);
      total %= 3600;
    }
    if (total < 60) {
      minute = 0;
    } else {
      minute = Math.floor(total / 60);
    }
    second = total % 60;
    return `${this.addPadding(hour)}:${this.addPadding(minute)}:${this.addPadding(second)}`;
  }

  addPadding(value: number): string {
    if (value < 10) {
      return '0' + value;
    } else {
      return value.toString();
    }
  }

  purchaseAlbum(): void {
    //
  }

  promoteAlbum(): void {
    //
  }

}

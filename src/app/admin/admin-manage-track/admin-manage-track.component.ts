import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';

import { Track } from 'src/app/shared/models/track';

@Component({
  selector: 'app-admin-manage-track',
  templateUrl: './admin-manage-track.component.html',
  styleUrls: ['./admin-manage-track.component.scss']
})
export class AdminManageTrackComponent implements OnInit {

  error = false;

  chosenTrackId: number;

  numberOfPages: number;
  currentPage: number;

  currentSort: string;

  allTracks: Track[];
  currentTrackList: Track[];

  constructor(
    public ms: NgbModal,
    public as: AuthService,
    public ads: AdminService,
    public sb: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.ads.getAllTracks()
      .subscribe((response: HttpResponse<Track[]>) => {
        this.allTracks = response.body;
        this.currentTrackList = this.allTracks.slice(0, 10);
        this.currentPage = 1;
        this.numberOfPages = this.allTracks.length !== 0 ? Math.floor((this.allTracks.length - 1) / 10) + 1 : 1;
        this.currentSort = 'track';
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

  openDelete(content: any, trackId: number): void {
    this.chosenTrackId = trackId;
    this.ms.open(content);
  }

  deleteTrack(): void {
    this.ms.dismissAll();
    this.ads.deleteTrack(this.chosenTrackId)
      .subscribe((response: HttpResponse<string>) => {
        this.showSnackBarMessage('Track successfully deleted', 'close', 2000);
        this.allTracks.forEach((track: Track, index: number, allTracks: Track[]) => {
          if (track.trackId === this.chosenTrackId) {
            allTracks.splice(index, 1);
          }
        });
        this.refreshTracks();
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.showSnackBarMessage('Track not found', 'close', 2000);
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
      this.currentTrackList = this.allTracks.slice((this.currentPage - 1) * 10, this.currentPage * 10);
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentTrackList = this.allTracks.slice((this.currentPage - 1) * 10, this.currentPage * 10);
    }
  }

  refreshTracks() {
    this.currentTrackList = this.allTracks.slice(0, 10);
    this.currentPage = 1;
    this.numberOfPages = this.allTracks.length !== 0 ? Math.floor((this.allTracks.length - 1) / 10) + 1 : 1;
  }

  sortById(): void {
    if (this.currentSort === 'id') {
      this.allTracks.reverse();
    } else {
      this.allTracks.sort((a: Track, b: Track): number => {
        return a.trackId - b.trackId;
      });
      this.currentSort = 'id';
    }
    this.refreshTracks();
  }

  sortByTrack(): void {
    if (this.currentSort === 'track') {
      this.allTracks.reverse();
    } else {
      this.allTracks.sort((a: Track, b: Track): number => {
        return a.trackName.localeCompare(b.trackName);
      });
      this.currentSort = 'track';
    }
    this.refreshTracks();
  }

  // Convert time in number of seconds to a more explicit format.
  convertTime(timeInSec: number) {
    let min: number;
    let sec: number;
    min = Math.floor(timeInSec / 60);
    sec = timeInSec - min * 60;
    let padM = min < 10 ? '0' : '';
    let padS = sec < 10 ? '0' : '';
    return `${padM}${min}:${padS}${sec}`;
  }

}

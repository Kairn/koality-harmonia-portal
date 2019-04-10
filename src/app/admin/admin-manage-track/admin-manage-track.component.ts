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
  }

  openDelete(content: any, trackId: number): void {
    this.chosenTrackId = trackId;
    this.ms.open(content);
  }

  deleteTrack(): void {
    this.ms.dismissAll();
    //
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

  refreshReviews() {
    this.currentTrackList = this.allTracks.slice(0, 10);
    this.currentPage = 1;
    this.numberOfPages = this.allTracks.length !== 0 ? Math.floor((this.allTracks.length - 1) / 10) + 1 : 1;
  }

  sortById(): void {
    //
  }

  sortByTrack(): void {
    //
  }

}

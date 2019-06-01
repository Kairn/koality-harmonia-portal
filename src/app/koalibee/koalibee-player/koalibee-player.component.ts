import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Track } from 'src/app/shared/models/track';

@Component({
  selector: 'app-koalibee-player',
  templateUrl: './koalibee-player.component.html',
  styleUrls: ['./koalibee-player.component.scss']
})
export class KoalibeePlayerComponent implements OnInit {

  album: Album;
  tracks: Track[];
  track: Track;

  howl: Howl;
  muted = false;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadAlbum();
    this.loadTracks();
  }

  loadAlbum(): void {
    if (!this.ks.albumPlaying) {
      this.router.navigate(['../inventory'], { relativeTo: this.route });
      return;
    } else {
      this.album = this.ks.albumPlaying;
    }
  }

  loadTracks(): void {
    if (!this.album) {
      this.ks.albumPlaying = null;
      this.router.navigate(['../inventory'], { relativeTo: this.route });
      return;
    }
    this.ks.getTracksInAlbum(this.album.albumId)
      .subscribe((response: HttpResponse<Track[]>) => {
        if (response.status === 200) {
          this.tracks = response.body;
          this.tracks.sort((a: Track, b: Track) => {
            return a.trackId - b.trackId;
          });
          this.loadTrackData(this.tracks[0].trackId);
        } else {
          this.ks.albumPlaying = null;
          this.router.navigate(['../inventory'], { relativeTo: this.route });
          return;
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.ks.albumPlaying = null;
          this.router.navigate(['../inventory'], { relativeTo: this.route });
          return;
        } else {
          this.as.clearData();
          this.ks.clearData();
          localStorage.clear();
          this.router.navigate(['/login'], { relativeTo: this.route });
        }
      });
  }

  loadTrackData(trackId: number): void {
    this.ks.getTrackById(trackId)
      .subscribe((response: HttpResponse<Track>) => {
        if (response.status === 200) {
          this.track = response.body;
          this.howl = new Howl({
            src: this.track.audioDataUrl
          });
        }
      }, (error: HttpErrorResponse) => {
        this.as.clearData();
        this.ks.clearData();
        localStorage.clear();
        this.router.navigate(['/login'], { relativeTo: this.route });
      });
  }

  playTrack(): void {
    if (this.howl) {
      this.howl.play();
    }
  }

  addPadding(value: number): string {
    if (value < 10) {
      return '0' + value;
    } else {
      return value.toString();
    }
  }

  getTime(time: number): string {
    let minute = 0;
    let second = 0;
    if (time < 60) {
      second = time;
    } else {
      minute = Math.floor(time / 60);
      second = time % 60;
    }
    return `${this.addPadding(minute)}:${this.addPadding(second)}`;
  }

}

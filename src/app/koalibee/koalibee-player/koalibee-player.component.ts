import { Component, OnInit, DoCheck, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, RouterEvent, NavigationStart } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Track } from 'src/app/shared/models/track';

@Component({
  selector: 'app-koalibee-player',
  templateUrl: './koalibee-player.component.html',
  styleUrls: ['./koalibee-player.component.scss']
})
export class KoalibeePlayerComponent implements OnInit, DoCheck {

  album: Album;
  tracks: Track[];
  track: Track;
  howl: Howl;

  idArr: number[];
  index: number;
  muted = false;
  looping = false;
  playTime = '00:00';
  volume = 60;

  update: any;
  loading = false;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public router: Router,
    public route: ActivatedRoute,
    public detect: ChangeDetectorRef
  ) {
    router.events.pipe(
      filter((e: RouterEvent) => e instanceof NavigationStart)
    ).subscribe(() => {
      if (this.howl) {
        this.stopTrack();
        this.howl.unload();
        this.howl = null;
      }
    });
  }

  ngOnInit() {
    this.loadAlbum();
    this.loadTracks();
  }

  ngDoCheck() {
    this.playTime = this.getPlayTime();
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
          this.idArr = [];
          this.tracks.forEach((track: Track) => {
            this.idArr.push(track.trackId);
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
    if (this.loading) {
      return;
    }
    if (this.track) {
      if (this.track.trackId === trackId) {
        return;
      }
    }
    this.loading = true;
    if (this.howl) {
      this.stopTrack();
      this.howl.unload();
    }
    this.howl = null;
    this.track = null;
    this.ks.getTrackById(trackId)
      .subscribe((response: HttpResponse<Track>) => {
        if (response.status === 200) {
          this.track = response.body;
          this.index = this.idArr.indexOf(this.track.trackId) + 1;
          this.howl = new Howl({
            src: this.track.audioDataUrl,
            volume: this.volume / 100
          });
          this.muted = false;
          this.looping = false;
          this.loading = false;
        }
      }, (error: HttpErrorResponse) => {
        this.as.clearData();
        this.ks.clearData();
        localStorage.clear();
        this.router.navigate(['/login'], { relativeTo: this.route });
      });
  }

  isSelected(trackId: number): boolean {
    if (!this.track) {
      return false;
    } else {
      return this.track.trackId === trackId;
    }
  }

  addPadding(value: number): string {
    if (value < 10) {
      return '0' + value;
    } else {
      return value.toString();
    }
  }

  getTime(time: any): string {
    time = Math.floor(time);
    let minute = 0;
    let second = 0;
    if (time < 60) {
      second = time;
    } else {
      minute = Math.floor(time / 60);
      second = Math.floor(time % 60);
    }
    if (!minute) {
      minute = 0;
    }
    if (!second) {
      second = 0;
    }
    return `${this.addPadding(minute)}:${this.addPadding(second)}`;
  }

  // Audio Controls
  isPlaying(): boolean {
    if (this.howl) {
      return this.howl.playing();
    }
    return false;
  }

  playTrack(): void {
    if (this.howl) {
      this.howl.play();
      this.update = setInterval(() => {
        this.detect.detectChanges();
      }, 500);
    }
  }

  pauseTrack(): void {
    if (this.howl) {
      this.howl.pause();
      clearInterval(this.update);
    }
  }

  stopTrack(): void {
    if (this.howl) {
      this.howl.stop();
      clearInterval(this.update);
    }
  }

  loopTrack(): void {
    if (this.howl) {
      this.howl.loop(true);
      this.looping = true;
    }
  }

  stopLoop(): void {
    if (this.howl) {
      this.howl.loop(false);
      this.looping = false;
    }
  }

  mute(): void {
    if (this.muted) {
      return;
    } else {
      if (this.howl) {
        this.howl.mute(true);
        this.muted = true;
      }
    }
  }

  unmute(): void {
    if (this.muted) {
      if (this.howl) {
        this.howl.mute(false);
        this.muted = false;
      }
    }
  }

  volDown(): void {
    if (this.muted) {
      return;
    } else {
      if (this.volume <= 0) {
        return;
      } else {
        if (this.howl) {
          this.volume -= 10;
          this.howl.volume(this.volume / 100);
        }
      }
    }
  }

  volUp(): void {
    if (!this.howl) {
      return;
    }
    if (this.muted) {
      this.howl.mute(false);
      this.muted = false;
    }
    if (this.volume < 100) {
      this.volume += 10;
      this.howl.volume(this.volume / 100);
    }
  }

  prevTrack(): void {
    if (this.index === 1) {
      return;
    } else {
      this.loadTrackData(this.idArr[this.index - 2]);
    }
  }

  nextTrack(): void {
    if (this.index === this.tracks.length) {
      return;
    } else {
      this.loadTrackData(this.idArr[this.index]);
    }
  }

  getPlayTime(): string {
    if (this.howl) {
      return this.getTime(this.howl.seek());
    }
    return '00:00';
  }

  getVolume(): string {
    return this.volume.toString();
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar, MatSelectionList, MatListOption } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Genre } from 'src/app/shared/models/genre';
import { Track } from 'src/app/shared/models/track';

@Component({
  selector: 'app-koalibee-edit-album',
  templateUrl: './koalibee-edit-album.component.html',
  styleUrls: ['./koalibee-edit-album.component.scss']
})
export class KoalibeeEditAlbumComponent implements OnInit {

  ALL_GENRES: Genre[];
  album: Album;
  allTracks: Track[] = [];
  trackDelSel: Track;

  albumEditForm: FormGroup;
  addTrackForm: FormGroup;
  publishForm: FormGroup;

  artPreview: string;
  audioData: string;

  @ViewChild('atf') atForm: NgForm;
  @ViewChild('pf') pForm: NgForm;

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

    this.album = this.ks.getAlbumInMaking();

    try {
      this.albumEditForm = this.fb.group({
        albumName: this.fb.control({ value: this.album.albumName, disabled: false }, Validators.required),
        artist: this.fb.control({ value: this.album.artist, disabled: false }, Validators.required),
        genre: this.fb.control({ value: this.album.genre.genreId, disabled: false }, null)
      });

      this.publishForm = this.fb.group({
        etaPrice: this.fb.control(
          { value: null, disabled: false },
          Validators.compose([Validators.required, Validators.min(1), Validators.max(9999)])
        ),
        freeFlag: this.fb.control({ value: null, disabled: false }, null),
        artwork: this.fb.control({ value: null, disabled: false }, Validators.required)
      });

      this.addTrackForm = this.fb.group({
        trackName: this.fb.control({ value: null, disabled: false }, Validators.required),
        composer: this.fb.control({ value: null, disabled: false }, Validators.required),
        trackLength: this.fb.control(
          { value: null, disabled: false },
          Validators.compose([Validators.required, Validators.min(1)])
        ),
        audio: this.fb.control({ value: null, disabled: false }, Validators.required),
        demoFlag: this.fb.control({ value: false, disabled: false }, null),
      });

      this.loadTracks();
    } catch (e) {
      this.router.navigate(['../manage-album'], { relativeTo: this.route });
    }
  }

  ngOnInit() {
    this.publishForm.controls.artwork.valueChanges
      .subscribe(() => {
        if (this.publishForm.controls.artwork.value) {
          this.loadArtwork();
        }
      });

    this.addTrackForm.controls.audio.valueChanges
      .subscribe(() => {
        if (this.addTrackForm.controls.audio.value) {
          this.loadAudio();
        }
      });
  }

  loadTracks(): void {
    this.ks.getTracksInAlbum(this.album.albumId)
      .subscribe((response: HttpResponse<Track[]>) => {
        if (response.status === 200) {
          this.allTracks = response.body;
          this.allTracks.sort((a: Track, b: Track) => {
            return a.trackId - b.trackId;
          });
        } else if (response.status === 204) {
          this.allTracks = [];
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.allTracks = [];
        } else {
          this.as.clearData();
          this.ks.clearData();
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    if (duration === -1) {
      this.sb.open(
        message,
        action
      );
      return;
    }
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  updateAlbumSubmit(): void {
    if (this.albumEditForm.invalid) {
      return;
    }
    let albumData = this.albumEditForm.value;
    albumData.genreId = this.albumEditForm.controls.genre.value;
    this.ks.updateAlbumInfo(JSON.stringify(albumData))
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 200) {
          this.showSnackBarMessage('Album has been updated, redirecting', 'close', 2000);
          setTimeout(() => {
            this.router.navigate(['../manage-album'], { relativeTo: this.route });
          }, 2200);
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage('Unable to update the album, please report an issue', 'close', 1500);
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

  showTracks(content: any): void {
    this.ms.open(content);
  }

  // Imperfect solution
  selectTrack(ts: MatSelectionList, track: Track) {
    ts.options.forEach((option: MatListOption) => {
      if (option.value.trackId === track.trackId) {
        if (option.selected) {
          this.trackDelSel = track;
          ts.deselectAll();
          ts.selectedOptions.select(option);
        } else {
          this.trackDelSel = null;
          ts.deselectAll();
        }
      }
    });
  }

  deleteTracks(): void {
    if (!this.trackDelSel) {
      this.showSnackBarMessage('Please select a track to delete', 'close', 1500);
      return;
    }
    this.ks.deleteTrackFromAlbum(this.trackDelSel.trackId)
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 200) {
          this.ms.dismissAll();
          this.showSnackBarMessage('Track has been removed from album', 'close', 2500);
          this.loadTracks();
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage('Unable to delete selected track', 'close', 2500);
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

  addTrackSubmit(): void {
    if (this.addTrackForm.invalid) {
      return;
    }
    if (!this.audioData) {
      this.showSnackBarMessage('Loading audio, please try again later', 'close', 1500);
      return;
    }
    let form = this.addTrackForm;
    let trackData: any = {};
    trackData.trackName = form.controls.trackName.value;
    trackData.composer = form.controls.composer.value;
    trackData.trackLength = form.controls.trackLength.value;
    trackData.isDemo = form.controls.demoFlag.value === true ? 'T' : 'F';
    trackData.audioDataUrl = this.audioData;
    this.showSnackBarMessage('Sending track information...', 'close', -1);
    this.ks.addTrackToAlbum(JSON.stringify(trackData))
      .subscribe((response: HttpResponse<string>) => {
        this.sb.dismiss();
        setTimeout(() => {
          if (response.status === 201) {
            this.atForm.resetForm();
            this.showSnackBarMessage('Track has been added', 'close', 2500);
            this.loadTracks();
          }
        }, 500);
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage('Failed to add track, please verify information', 'close', 2000);
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

  openPreview(content: any) {
    let artwork = new FileReader();
    artwork.onload = () => {
      this.artPreview = artwork.result.toString();
      this.ms.open(content);
    };
    if (this.publishForm.controls.artwork.value) {
      artwork.readAsDataURL(this.publishForm.controls.artwork.value.files[0]);
    } else {
      return;
    }
  }

  checkFreeFlag(): void {
    if (this.publishForm.controls.freeFlag.value === true) {
      this.publishForm.controls.etaPrice.reset();
      this.publishForm.controls.etaPrice.disable();
    } else {
      this.publishForm.controls.etaPrice.enable();
    }
  }

  loadArtwork(): void {
    this.artPreview = null;
    let artwork = new FileReader();
    artwork.onload = () => {
      this.artPreview = artwork.result.toString();
    };
    if (this.publishForm.controls.artwork.value) {
      artwork.readAsDataURL(this.publishForm.controls.artwork.value.files[0]);
    } else {
      return;
    }
  }

  loadAudio(): void {
    this.audioData = null;
    let audio = new FileReader();
    audio.onload = () => {
      this.audioData = audio.result.toString();
    };
    if (this.addTrackForm.controls.audio.value) {
      audio.readAsDataURL(this.addTrackForm.controls.audio.value.files[0]);
    } else {
      return;
    }
  }

  openPublish(content: any): void {
    if (this.publishForm.invalid) {
      return;
    }
    if (!this.artPreview) {
      this.showSnackBarMessage('Loading image, please try again later', 'close', 1500);
      return;
    }
    if (this.allTracks.length < 1) {
      this.showSnackBarMessage('Please add at least one track before publishing', 'close', 1500);
      return;
    }
    this.ms.open(content);
  }

  publishAlbumSubmit(): void {
    let albumData: any = {};
    albumData.etaPrice = this.publishForm.controls.etaPrice.value;
    if (this.publishForm.controls.freeFlag.value) {
      albumData.etaPrice = 0;
    }
    albumData.artworkDataUrl = this.artPreview;
    this.ks.publishAlbum(JSON.stringify(albumData))
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 200) {
          this.ms.dismissAll();
          this.pForm.resetForm();
          this.showSnackBarMessage('Album has been published, redirecting...', 'close', 2500);
          this.ks.loadKoalibeeData();
          this.ks.loadAlbumCollection();
          setTimeout(() => {
            this.router.navigate(['../manage-album'], { relativeTo: this.route });
          }, 2800);
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage('Failed to publish album, please verify data', 'close', 2500);
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

}

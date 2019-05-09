import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Genre } from 'src/app/shared/models/genre';

@Component({
  selector: 'app-koalibee-edit-album',
  templateUrl: './koalibee-edit-album.component.html',
  styleUrls: ['./koalibee-edit-album.component.scss']
})
export class KoalibeeEditAlbumComponent implements OnInit {

  ALL_GENRES: Genre[];
  album: Album;

  albumEditForm: FormGroup;
  addTrackForm: FormGroup;
  publishForm: FormGroup;

  artPreview: string;

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
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  updateAlbumSubmit(): void {
    console.log(this.albumEditForm);
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

  openPublish(content: any): void {
    this.ms.open(content);
  }

  publishAlbum(): void {
    console.log(this.publishForm);
  }

}

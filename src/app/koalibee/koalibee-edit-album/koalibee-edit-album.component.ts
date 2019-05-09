import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';

@Component({
  selector: 'app-koalibee-edit-album',
  templateUrl: './koalibee-edit-album.component.html',
  styleUrls: ['./koalibee-edit-album.component.scss']
})
export class KoalibeeEditAlbumComponent implements OnInit {

  albumEditForm: FormGroup;
  addTrackForm: FormGroup;
  publishForm: FormGroup;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public ms: NgbModal,
    public router: Router,
    public route: ActivatedRoute,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  publishAlbum(): void {
    //
  }

}

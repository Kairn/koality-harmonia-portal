import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

@Component({
  selector: 'app-koalibee-manage-album',
  templateUrl: './koalibee-manage-album.component.html',
  styleUrls: ['./koalibee-manage-album.component.scss']
})
export class KoalibeeManageAlbumComponent implements OnInit {

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public router: Router,
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

}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

@Component({
  selector: 'app-koalibee-profile',
  templateUrl: './koalibee-profile.component.html',
  styleUrls: ['./koalibee-profile.component.scss']
})
export class KoalibeeProfileComponent implements OnInit {

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
  }

}

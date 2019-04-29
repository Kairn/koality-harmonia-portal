import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';

import { MyErrorStateMatcher } from '../../core/register/register.component';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

@Component({
  selector: 'app-koalibee-profile',
  templateUrl: './koalibee-profile.component.html',
  styleUrls: ['./koalibee-profile.component.scss']
})
export class KoalibeeProfileComponent implements OnInit {

  koalibeeInfoForm: FormGroup;
  koalibeeCredForm: FormGroup;

  matcher: ErrorStateMatcher;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.matcher = new MyErrorStateMatcher();

    this.koalibeeInfoForm = this.fb.group({
      firstName: [this.ks.getKoalibee().firstName, Validators.minLength(1)],
      lastName: [this.ks.getKoalibee().lastName, Validators.minLength(1)],
      avatar: [null, null]
    });

    this.koalibeeCredForm = this.fb.group({
      email: [this.ks.getKoalibee().email, Validators.compose([Validators.minLength(1), Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(fg: FormGroup): any {
    return fg.get('password').value === fg.get('confirmPassword').value ? null : { psMatch: true };
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  infoUpdateSubmit(): void {
    console.log(this.koalibeeInfoForm.value);
  }

  credUpdateSubmit(): void {
    console.log(this.koalibeeCredForm.value);
  }

}

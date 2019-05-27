import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';

import { AuthService } from '../services/auth.service';
import { KoalibeeService } from '../services/koalibee.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  isDebug(): boolean {
    return AuthService.debug_mode;
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  loginSubmit(debugData?: string): void {
    localStorage.clear();
    let loginData: string;
    if (debugData) {
      loginData = debugData;
    } else {
      loginData = JSON.stringify(this.loginForm.value);
    }
    this.as.login(loginData)
      .subscribe((response: HttpResponse<string>) => {
        localStorage.setItem('Expire-Time', (Date.now() + 1790000).toString());
        localStorage.setItem('Auth-Token', response.body);
        this.as.setKoalibeeId(parseInt(JSON.parse(atob(response.body.split('.')[1]))['koalibeeId'], 10));
        if (this.as.getKoalibeeId() === -777) {
          this.router.navigate(['/admin']);
        } else {
          localStorage.setItem('koalibeeId', this.as.getKoalibeeId().toString());
          this.ks.loadKoalibeeData();
          this.ks.loadAlbumCollection();
          this.ks.loadAlbumBinder();
          this.router.navigate(['/koalibee']);
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.showSnackBarMessage('Invalid credentials', 'close', 2000);
        } else {
          this.showSnackBarMessage('Unknown error occurred', 'close', 2000);
        }
      });
  }

  canDebug(): boolean {
    try {
      if (this.loginForm.controls.email.value && !this.loginForm.controls.password.value) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  debugLogin(): void {
    let debugData: any = {};
    debugData.email = this.loginForm.controls.email.value + '.koality@mailinator.com';
    debugData.password = this.loginForm.controls.email.value + '123456';
    this.loginSubmit(JSON.stringify(debugData));
  }

}

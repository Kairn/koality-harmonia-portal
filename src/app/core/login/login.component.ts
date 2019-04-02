import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';

import { AuthService } from '../services/auth.service';

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
    public sb: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  loginSubmit(): void {
    localStorage.clear();
    this.as.login(JSON.stringify(this.loginForm.value))
      .subscribe((response: HttpResponse<string>) => {
        localStorage.setItem('Auth-Token', response.body);
        this.as.setKoalibeeId(parseInt(JSON.parse(atob(response.body.split('.')[1]))['koalibeeId'], 10));
        if (this.as.getKoalibeeId() === -777) {
          this.router.navigate(['/admin']);
        } else {
          localStorage.setItem('koalibeeId', this.as.getKoalibeeId().toString());
          this.router.navigate(['/koalibee']);
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.showSnackBarMessage('Invalid credentials', 'close', 2500);
        } else {
          this.showSnackBarMessage('Unknown error', 'close', 2500);
        }
      });
  }

}

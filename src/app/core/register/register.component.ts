import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { ErrorStateMatcher } from '@angular/material/core';

import { AuthService } from '../services/auth.service';

/**
 * Custom error state matcher for Angular Material.
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(fc: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return fc.touched && form.dirty && form.hasError('psMatch');
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  matcher: ErrorStateMatcher;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public as: AuthService,
    public sb: MatSnackBar
  ) { }

  ngOnInit() {
    this.matcher = new MyErrorStateMatcher();

    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
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

  registerSubmit(): void {
    localStorage.clear();
    this.as.register(JSON.stringify(this.registerForm.value))
      .subscribe((response: HttpResponse<string>) => {
        localStorage.setItem('Auth-Token', response.body);
        this.as.setKoalibeeId(parseInt(JSON.parse(atob(response.body.split('.')[1]))['koalibeeId'], 10));
        localStorage.setItem('koalibeeId', this.as.getKoalibeeId().toString());
        this.showSnackBarMessage('Registration successful, redirecting', 'close', 2500);
        setTimeout(() => {
          this.router.navigate(['/koalibee']);
        }, 3000);
      }, (error: HttpErrorResponse) => {
        this.showSnackBarMessage('Unable to register due to system error', 'close', 2500);
      });
  }

}

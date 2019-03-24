import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';

import { ErrorStateMatcher } from '@angular/material/core';

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
    public fb: FormBuilder
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

}

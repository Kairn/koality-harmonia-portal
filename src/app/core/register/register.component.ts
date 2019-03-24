import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  passwordsMatched(): boolean {
    const ps = this.registerForm.get('password').value;
    const psc = this.registerForm.get('confirmPassword').value;

    if (ps == null || psc == null) {
      return false;
    }
    if (ps.toString().length < 1 || psc.toString().length < 1) {
      return false;
    } else {
      return ps.toString() === psc.toString();
    }
  }
}

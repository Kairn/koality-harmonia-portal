import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  avatarPreview: string;

  matcher: ErrorStateMatcher;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public sb: MatSnackBar,
    public ms: NgbModal,
    public router: Router,
    public fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.matcher = new MyErrorStateMatcher();

    this.koalibeeInfoForm = this.fb.group({
      firstName: this.fb.control({ value: null, disabled: true }, Validators.required),
      lastName: this.fb.control({ value: null, disabled: true }, Validators.required),
      avatar: this.fb.control({ value: null, disabled: false })
    });

    this.koalibeeCredForm = this.fb.group({
      email: this.fb.control({ value: null, disabled: true }, Validators.compose([Validators.required, Validators.email])),
      password: this.fb.control({ value: null, disabled: true }, Validators.compose([Validators.minLength(6)])),
      confirmPassword: this.fb.control({ value: null, disabled: true }, Validators.required)
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

  enableFirstName(): void {
    if (this.koalibeeInfoForm.controls.firstName.disabled) {
      this.koalibeeInfoForm.controls.firstName.enable();
      this.koalibeeInfoForm.controls.firstName.setValue(this.ks.getKoalibee().firstName);
    }
  }

  clearFirstName(): void {
    this.koalibeeInfoForm.controls.firstName.reset();
    this.koalibeeInfoForm.controls.firstName.disable();
  }

  enableLastName(): void {
    if (this.koalibeeInfoForm.controls.lastName.disabled) {
      this.koalibeeInfoForm.controls.lastName.enable();
      this.koalibeeInfoForm.controls.lastName.setValue(this.ks.getKoalibee().lastName);
    }
  }

  clearLastName(): void {
    this.koalibeeInfoForm.controls.lastName.reset();
    this.koalibeeInfoForm.controls.lastName.disable();
  }

  enableEmail(): void {
    if (this.koalibeeCredForm.controls.email.disabled) {
      this.koalibeeCredForm.controls.email.enable();
      this.koalibeeCredForm.controls.email.setValue(this.ks.getKoalibee().email);
    }
  }

  clearEmail(): void {
    this.koalibeeCredForm.controls.email.reset();
    this.koalibeeCredForm.controls.email.disable();
  }

  enablePassword(): void {
    if (this.koalibeeCredForm.controls.password.disabled) {
      this.koalibeeCredForm.controls.password.enable();
      this.koalibeeCredForm.controls.confirmPassword.enable();
    }
  }

  clearPassword(): void {
    this.koalibeeCredForm.controls.password.reset();
    this.koalibeeCredForm.controls.password.disable();
    this.koalibeeCredForm.controls.confirmPassword.reset();
    this.koalibeeCredForm.controls.confirmPassword.disable();
  }

  clearAvatar(): void {
    this.koalibeeInfoForm.controls.avatar.setValue(null);
  }

  openPreview(content: any): void {
    let avatar = new FileReader();
    avatar.onload = () => {
      this.avatarPreview = avatar.result.toString();
      this.ms.open(content);
    };
    if (this.koalibeeInfoForm.controls.avatar.value) {
      avatar.readAsDataURL(this.koalibeeInfoForm.controls.avatar.value.files[0]);
    } else {
      return;
    }
  }

  infoUpdateSubmit(): void {
    console.log(this.koalibeeInfoForm);
  }

  credUpdateSubmit(): void {
    console.log(this.koalibeeCredForm);
  }

}

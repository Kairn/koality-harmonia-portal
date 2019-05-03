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

    this.koalibeeInfoForm.controls.avatar.valueChanges
      .subscribe(() => {
        if (this.koalibeeInfoForm.controls.avatar.value) {
          this.loadAvatar();
        }
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

  loadAvatar(): void {
    let avatar = new FileReader();
    avatar.onload = () => {
      this.avatarPreview = avatar.result.toString();
    };
    if (this.koalibeeInfoForm.controls.avatar.value) {
      avatar.readAsDataURL(this.koalibeeInfoForm.controls.avatar.value.files[0]);
    } else {
      return;
    }
  }

  openPreview(content: any): void {
    let avatar = new FileReader();
    avatar.onload = () => {
      this.avatarPreview = avatar.result.toString();
      // Open dialog after loading is done
      this.ms.open(content);
    };
    if (this.koalibeeInfoForm.controls.avatar.value) {
      avatar.readAsDataURL(this.koalibeeInfoForm.controls.avatar.value.files[0]);
    } else {
      return;
    }
  }

  canSubmitInfo(): boolean {
    return this.koalibeeInfoForm.controls.firstName.value ||
      this.koalibeeInfoForm.controls.lastName.value ||
      this.koalibeeInfoForm.controls.avatar.value;
  }

  canSubmitCred(): boolean {
    return this.koalibeeCredForm.controls.email.value ||
      this.koalibeeCredForm.controls.password.value;
  }

  infoUpdateSubmit(): void {
    let koalibeeData: any = {};
    let form = this.koalibeeInfoForm;
    if (form.invalid) {
      this.showSnackBarMessage('Form validation check failed', 'close', 1500);
      return;
    }
    if (form.controls.firstName.enabled) {
      koalibeeData.firstName = form.controls.firstName.value;
    } else {
      koalibeeData.firstName = null;
    }
    if (form.controls.lastName.enabled) {
      koalibeeData.lastName = form.controls.lastName.value;
    } else {
      koalibeeData.lastName = null;
    }
    if (form.controls.avatar.value) {
      if (!this.avatarPreview) {
        this.showSnackBarMessage('Loading image, please try again later', 'close', 1500);
        return;
      } else {
        koalibeeData.avatarDataUrl = this.avatarPreview;
      }
    } else {
      koalibeeData.avatarDataUrl = null;
    }
    // Send request
    form.reset();
    this.clearFirstName();
    this.clearLastName();
    this.clearAvatar();
    this.ks.updateKoalibeeInformation(JSON.stringify(koalibeeData))
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 200) {
          this.showSnackBarMessage('Your information has been updated', 'close', 2500);
          this.ks.loadKoalibeeData();
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage('Update failed, please try again or report an issue', 'close', 2000);
        } else {
          this.showSnackBarMessage('Access denied or session expired', 'close', 2500);
          setTimeout(() => {
            this.as.clearData();
            this.ks.clearData();
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 2500);
        }
      });
  }

  credUpdateSubmit(): void {
    let credentialsData: any = {};
    let form = this.koalibeeCredForm;
    if (form.invalid) {
      this.showSnackBarMessage('Form validation check failed', 'close', 1500);
      return;
    }
    if (form.controls.email.enabled) {
      credentialsData.email = form.controls.email.value;
    } else {
      credentialsData.email = null;
    }
    if (form.controls.password.enabled) {
      credentialsData.password = form.controls.password.value;
    } else {
      credentialsData.password = null;
    }
    // Send request
    form.reset();
    this.clearEmail();
    this.clearPassword();
    this.ks.updateKoalibeeCredentials(JSON.stringify(credentialsData))
      .subscribe((response: HttpResponse<string>) => {
        if (response.status === 200) {
          this.showSnackBarMessage('Your credentials have been updated', 'close', 2500);
          this.ks.loadKoalibeeData();
        }
      }, (error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.showSnackBarMessage('Update failed, please try with different data', 'close', 2000);
        } else {
          this.showSnackBarMessage('Access denied or session expired', 'close', 2500);
          setTimeout(() => {
            this.as.clearData();
            this.ks.clearData();
            localStorage.clear();
            this.router.navigate(['/login']);
          }, 2500);
        }
      });
  }

}

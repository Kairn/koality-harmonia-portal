import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material.module';

import { CoreRoutingModule } from './core-routing.module';
import { SharedModule } from '../shared/shared.module';

import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    LandingComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundComponent,
    AboutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    CoreRoutingModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    MaterialModule,
    NgbModule
  ]
})
export class CoreModule { }

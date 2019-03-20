import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material.module';

import { AdminRoutingModule } from './admin-routing.module';

import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminManagePanelComponent } from './admin-manage-panel/admin-manage-panel.component';
import { AdminManageKoalibeeComponent } from './admin-manage-koalibee/admin-manage-koalibee.component';
import { AdminManageMomentComponent } from './admin-manage-moment/admin-manage-moment.component';
import { AdminManageAlbumComponent } from './admin-manage-album/admin-manage-album.component';
import { AdminManageTrackComponent } from './admin-manage-track/admin-manage-track.component';
import { AdminManageReviewComponent } from './admin-manage-review/admin-manage-review.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminDashboardComponent,
    AdminManagePanelComponent,
    AdminManageKoalibeeComponent,
    AdminManageMomentComponent,
    AdminManageAlbumComponent,
    AdminManageTrackComponent,
    AdminManageReviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MaterialModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

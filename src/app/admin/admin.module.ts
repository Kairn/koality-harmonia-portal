import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminManageKoalibeeComponent } from './admin-manage-koalibee/admin-manage-koalibee.component';
import { AdminManageMomentComponent } from './admin-manage-moment/admin-manage-moment.component';
import { AdminManageAlbumComponent } from './admin-manage-album/admin-manage-album.component';
import { AdminManageTrackComponent } from './admin-manage-track/admin-manage-track.component';
import { AdminManageReviewComponent } from './admin-manage-review/admin-manage-review.component';

@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminDashboardComponent,
    AdminManageKoalibeeComponent,
    AdminManageMomentComponent,
    AdminManageAlbumComponent,
    AdminManageTrackComponent,
    AdminManageReviewComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }

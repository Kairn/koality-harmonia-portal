import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminManagePanelComponent } from './admin-manage-panel/admin-manage-panel.component';
import { AdminManageKoalibeeComponent } from './admin-manage-koalibee/admin-manage-koalibee.component';
import { AdminManageMomentComponent } from './admin-manage-moment/admin-manage-moment.component';
import { AdminManageAlbumComponent } from './admin-manage-album/admin-manage-album.component';
import { AdminManageTrackComponent } from './admin-manage-track/admin-manage-track.component';
import { AdminManageReviewComponent } from './admin-manage-review/admin-manage-review.component';

import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: AdminHomeComponent, children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent
      },
      {
        path: 'manage',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'panel', component: AdminManagePanelComponent },
          { path: 'koalibee', component: AdminManageKoalibeeComponent },
          { path: 'moment', component: AdminManageMomentComponent },
          { path: 'album', component: AdminManageAlbumComponent },
          { path: 'track', component: AdminManageTrackComponent },
          { path: 'review', component: AdminManageReviewComponent },
          { path: '', redirectTo: 'panel', pathMatch: 'full' }
        ]
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }

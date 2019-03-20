import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KoalibeeHomeComponent } from './koalibee-home/koalibee-home.component';
import { KoalibeeDashboardComponent } from './koalibee-dashboard/koalibee-dashboard.component';
import { KoalibeeStoreComponent } from './koalibee-store/koalibee-store.component';
import { KoalibeeProfileComponent } from './koalibee-profile/koalibee-profile.component';
import { KoalibeeManageAlbumComponent } from './koalibee-manage-album/koalibee-manage-album.component';
import { KoalibeeEditAlbumComponent } from './koalibee-edit-album/koalibee-edit-album.component';
import { KoalibeeInventoryComponent } from './koalibee-inventory/koalibee-inventory.component';
import { KoalibeePlayerComponent } from './koalibee-player/koalibee-player.component';

import { AuthGuard } from '../core/guards/auth.guard';
import { EditAlbumGuard } from '../core/guards/edit-album.guard';
import { PlayerGuard } from '../core/guards/player.guard';

const routes: Routes = [
  {
    path: '', component: KoalibeeHomeComponent, children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'dashboard', component: KoalibeeDashboardComponent },
          { path: 'store', component: KoalibeeStoreComponent },
          { path: 'profile', component: KoalibeeProfileComponent },
          { path: 'manage-album', component: KoalibeeManageAlbumComponent },
          { path: 'edit-album', component: KoalibeeEditAlbumComponent, canActivate: [EditAlbumGuard] },
          { path: 'inventory', component: KoalibeeInventoryComponent },
          { path: 'player', component: KoalibeePlayerComponent, canActivate: [PlayerGuard] },
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
      }
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
export class KoalibeeRoutingModule { }

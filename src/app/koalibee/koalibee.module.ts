import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material.module';

import { KoalibeeRoutingModule } from './koalibee-routing.module';
import { SharedModule } from '../shared/shared.module';

import { KoalibeeHomeComponent } from './koalibee-home/koalibee-home.component';
import { KoalibeeDashboardComponent } from './koalibee-dashboard/koalibee-dashboard.component';
import { KoalibeeStoreComponent } from './koalibee-store/koalibee-store.component';
import { KoalibeeProfileComponent } from './koalibee-profile/koalibee-profile.component';
import { KoalibeeManageAlbumComponent } from './koalibee-manage-album/koalibee-manage-album.component';
import { KoalibeeEditAlbumComponent } from './koalibee-edit-album/koalibee-edit-album.component';
import { KoalibeeInventoryComponent } from './koalibee-inventory/koalibee-inventory.component';
import { KoalibeePlayerComponent } from './koalibee-player/koalibee-player.component';
import { KoalibeeAlbumDetailComponent } from './koalibee-album-detail/koalibee-album-detail.component';

@NgModule({
  declarations: [
    KoalibeeHomeComponent,
    KoalibeeDashboardComponent,
    KoalibeeStoreComponent,
    KoalibeeProfileComponent,
    KoalibeeManageAlbumComponent,
    KoalibeeEditAlbumComponent,
    KoalibeeInventoryComponent,
    KoalibeePlayerComponent,
    KoalibeeAlbumDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MaterialModule,
    KoalibeeRoutingModule,
    SharedModule
  ]
})
export class KoalibeeModule { }

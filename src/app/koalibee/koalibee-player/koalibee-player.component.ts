import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { AuthService } from 'src/app/core/services/auth.service';
import { KoalibeeService } from 'src/app/core/services/koalibee.service';

import { Album } from 'src/app/shared/models/album';
import { Track } from 'src/app/shared/models/track';

@Component({
  selector: 'app-koalibee-player',
  templateUrl: './koalibee-player.component.html',
  styleUrls: ['./koalibee-player.component.scss']
})
export class KoalibeePlayerComponent implements OnInit {

  album: Album;
  tracks: Track[];
  track: Track;

  constructor(
    public as: AuthService,
    public ks: KoalibeeService,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadAlbum();
  }

  loadAlbum(): void {
    if (!this.ks.albumPlaying) {
      this.router.navigate(['../inventory'], { relativeTo: this.route });
      return;
    }
    this.ks.getAlbumById(this.ks.albumPlaying.albumId)
      .subscribe((response: HttpResponse<Album>) => {
        if (response.status === 200) {
          this.album = response.body;
        }
      }, (error: HttpErrorResponse) => {
        this.as.clearData();
        this.ks.clearData();
        localStorage.clear();
        this.router.navigate(['/login']);
      });
  }

}

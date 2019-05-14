import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

import { Review } from 'src/app/shared/models/review';
import { Track } from 'src/app/shared/models/track';
import { Album } from 'src/app/shared/models/album';
import { Koalibee } from 'src/app/shared/models/koalibee';

@Injectable({
  providedIn: 'root'
})
export class KoalibeeService {

  private koalibee: Koalibee;
  private albumInMaking: Album;

  constructor(
    public http: HttpClient,
    public router: Router,
    public as: AuthService
  ) {
    if (localStorage.getItem('koalibeeId') && localStorage.getItem('Auth-Token')) {
      this.loadKoalibeeData();
    }
  }

  getKoalibee(): Koalibee {
    return this.koalibee;
  }

  setKoalibee(koalibee: Koalibee): void {
    this.koalibee = koalibee;
  }

  getAlbumInMaking(): Album {
    return this.albumInMaking;
  }

  setAlbumInMaking(album: Album): void {
    this.albumInMaking = album;
  }

  // Deprecated
  isReady(): boolean {
    try {
      let temp = this.koalibee.firstName;
      return true;
    } catch (e) {
      return false;
    }
  }

  loadKoalibeeData(): void {
    this.fetchKoalibee()
      .subscribe((response: HttpResponse<Koalibee>) => {
        if (response.status === 200) {
          this.setKoalibee(response.body);
        }
      }, (error: HttpErrorResponse) => {
        localStorage.clear();
        this.as.clearData();
        this.clearData();
        this.router.navigate(['/login']);
      });
  }

  clearData(): void {
    this.koalibee = null;
    this.albumInMaking = null;
  }

  postMoment(momentData: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      AuthService.baseUrl + 'moment/' + 'post/' + localStorage.getItem('koalibeeId'),
      momentData,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  fetchKoalibee(): Observable<HttpResponse<Koalibee>> {
    return this.http.get<Koalibee>(
      AuthService.baseUrl + 'koalibee/' + 'get/' + this.as.getKoalibeeId(),
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  updateKoalibeeCredentials(credentialsData: string): Observable<HttpResponse<string>> {
    return this.http.put<string>(
      AuthService.baseUrl + 'koalibee/' + 'credentials/' + this.as.getKoalibeeId(),
      credentialsData,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  updateKoalibeeInformation(koalibeeData: string): Observable<HttpResponse<string>> {
    return this.http.put<string>(
      AuthService.baseUrl + 'koalibee/' + 'profile/' + this.as.getKoalibeeId(),
      koalibeeData,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  getUnpublished(): Observable<HttpResponse<Album[]>> {
    return this.http.get<Album[]>(
      AuthService.baseUrl + 'koalibee/' + 'album/' + 'unpublished/' + this.as.getKoalibeeId(),
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  createNewAlbum(albumData: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      AuthService.baseUrl + 'album/' + 'create/' + this.as.getKoalibeeId(),
      albumData,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  deleteUnfinishedAlbum(albumId: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      AuthService.baseUrl + 'album/' + 'delete/' + albumId,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  updateAlbumInfo(albumData: string): Observable<HttpResponse<string>> {
    return this.http.put<string>(
      AuthService.baseUrl + 'album/' + 'update/' + this.albumInMaking.albumId,
      albumData,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  addTrackToAlbum(trackData: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      AuthService.baseUrl + 'track/' + 'addto/' + this.albumInMaking.albumId,
      trackData,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  publishAlbum(albumData: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      AuthService.baseUrl + 'album/' + 'publish/' + this.albumInMaking.albumId,
      albumData,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  getTracksInAlbum(albumId: number): Observable<HttpResponse<Track[]>> {
    return this.http.get<Track[]>(
      AuthService.baseUrl + 'track/' + 'inalbum/' + albumId,
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  deleteTrackFromAlbum(trackId: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      AuthService.baseUrl + 'track/' + 'delete/' + trackId,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  // Big operation
  getAllPublishedAlbums(): Observable<HttpResponse<Album[]>> {
    return this.http.get<Album[]>(
      AuthService.baseUrl + 'album/' + 'get/' + 'published',
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  getAlbumById(albumId: number): Observable<HttpResponse<Album>> {
    return this.http.get<Album>(
      AuthService.baseUrl + 'album/' + 'get/' + albumId,
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  getInventory(): Observable<HttpResponse<Album[]>> {
    return this.http.get<Album[]>(
      AuthService.baseUrl + 'koalibee/' + 'album/' + 'owned/' + this.as.getKoalibeeId(),
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

}

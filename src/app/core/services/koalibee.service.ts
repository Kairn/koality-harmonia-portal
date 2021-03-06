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

  // All albums in store with artwork data
  public albumCollection: Album[];
  // All albums in inventory
  public albumBinder: Album[];
  // Album currently being played
  public albumPlaying: Album;

  constructor(
    public http: HttpClient,
    public router: Router,
    public as: AuthService
  ) {
    if (localStorage.getItem('koalibeeId') && localStorage.getItem('Auth-Token') && localStorage.getItem('Expire-Time')) {
      if (Date.now() - parseInt(localStorage.getItem('Expire-Time'), 10) > 0) {
        localStorage.clear();
        if (this.router.url.includes('koalibee')) {
          this.router.navigate(['/login']);
        }
        return;
      }
      this.loadKoalibeeData();
      this.loadAlbumCollection();
      this.loadAlbumBinder();
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

  loadAlbumCollection(): void {
    this.getAllPublishedAlbums()
      .subscribe((response: HttpResponse<Album[]>) => {
        if (response.status === 200) {
          this.albumCollection = response.body;
        }
      }, (error: HttpErrorResponse) => {
        localStorage.clear();
        this.as.clearData();
        this.clearData();
        this.router.navigate(['/login']);
      });
  }

  loadAlbumBinder(): void {
    this.getInventory()
      .subscribe((response: HttpResponse<Album[]>) => {
        if (response.status === 200) {
          this.albumBinder = response.body;
          this.albumBinder.sort((a: Album, b: Album) => {
            return a.albumName.localeCompare(b.albumName);
          });
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
    this.albumCollection = null;
    this.albumBinder = null;
    this.albumPlaying = null;
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
      AuthService.baseUrl + 'koalibee/' + 'get/' + localStorage.getItem('koalibeeId'),
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
      AuthService.baseUrl + 'koalibee/' + 'credentials/' + localStorage.getItem('koalibeeId'),
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
      AuthService.baseUrl + 'koalibee/' + 'profile/' + localStorage.getItem('koalibeeId'),
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
      AuthService.baseUrl + 'koalibee/' + 'album/' + 'unpublished/' + localStorage.getItem('koalibeeId'),
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
      AuthService.baseUrl + 'album/' + 'create/' + localStorage.getItem('koalibeeId'),
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
      AuthService.baseUrl + 'koalibee/' + 'album/' + 'owned/' + localStorage.getItem('koalibeeId'),
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  getTrackById(trackId: number): Observable<HttpResponse<Track>> {
    return this.http.get<Track>(
      AuthService.baseUrl + 'track/' + 'get/' + trackId,
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  promoteAlbum(albumId: number): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      AuthService.baseUrl + 'album/' + 'promote/' + albumId,
      null,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  purchaseAlbum(albumData: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      AuthService.baseUrl + 'koalibee/' + 'purchase/' + localStorage.getItem('koalibeeId'),
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

  getAlbumReviews(albumId: number): Observable<HttpResponse<Review[]>> {
    return this.http.get<Review[]>(
      AuthService.baseUrl + 'review/' + 'get/' + 'album/' + albumId,
      {
        observe: 'response'
      }
    );
  }

  postAlbumReview(albumId: number, reviewData: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      AuthService.baseUrl + 'review/' + 'post/' + albumId,
      reviewData,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

}

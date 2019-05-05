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

}

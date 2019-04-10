import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

import { Moment } from 'src/app/shared/models/moment';
import { Review } from 'src/app/shared/models/review';
import { Track } from 'src/app/shared/models/track';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public as: AuthService
  ) { }

  getAllMoments(): Observable<HttpResponse<Moment[]>> {
    return this.http.get<Moment[]>(
      AuthService.baseUrl + 'moment/' + 'get/' + 'all',
      { observe: 'response' }
    );
  }

  deleteMoment(momentId: number): Observable<HttpResponse<String>> {
    return this.http.delete<String>(
      AuthService.baseUrl + 'moment/' + 'delete/' + momentId,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  getAllReviews(): Observable<HttpResponse<Review[]>> {
    return this.http.get<Review[]>(
      AuthService.baseUrl + 'review/' + 'get/' + 'all',
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  deleteReview(reviewId: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      AuthService.baseUrl + 'review/' + 'delete/' + reviewId,
      {
        observe: 'response',
        responseType: 'text' as 'json',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  getAllTracks(): Observable<HttpResponse<Track[]>> {
    return this.http.get<Track[]>(
      AuthService.baseUrl + 'track/' + 'get/' + 'all',
      {
        observe: 'response',
        headers: new HttpHeaders({
          'Auth-Token': localStorage.getItem('Auth-Token')
        })
      }
    );
  }

  deleteTrack(trackId: number): Observable<HttpResponse<String>> {
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

}

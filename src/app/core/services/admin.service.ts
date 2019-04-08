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

}

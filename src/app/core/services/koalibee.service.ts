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
import { Album } from 'src/app/shared/models/album';
import { Koalibee } from 'src/app/shared/models/koalibee';

@Injectable({
  providedIn: 'root'
})
export class KoalibeeService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public as: AuthService
  ) { }

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

}

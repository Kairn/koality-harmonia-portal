import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static localUrl = 'http://localhost:8080/koality-harmonia-rest/';
  public static baseUrl = 'http://ec2-13-59-150-21.us-east-2.compute.amazonaws.com:8080/koality-harmonia-rest/';

  private koalibeeId: number;

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  getKoalibeeId(): number {
    return this.koalibeeId;
  }

  setKoalibeeId(koalibeeId: number): void {
    this.koalibeeId = koalibeeId;
  }

  login(credentialsData: string): Observable<HttpResponse<string>> {
    return this.http.post<string>(
      AuthService.baseUrl + 'koalibee' + '/login',
      credentialsData,
      { responseType: 'text' as 'json', observe: 'response' }
    );
  }

}

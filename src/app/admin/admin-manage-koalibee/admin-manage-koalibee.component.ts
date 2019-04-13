import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { MatSnackBar } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { AdminService } from '../../core/services/admin.service';

import { Koalibee } from '../../shared/models/koalibee';

@Component({
  selector: 'app-admin-manage-koalibee',
  templateUrl: './admin-manage-koalibee.component.html',
  styleUrls: ['./admin-manage-koalibee.component.scss']
})
export class AdminManageKoalibeeComponent implements OnInit {

  error: true;

  chosenKoalibeeId: number;

  numberOfPages: number;
  currentPage: number;

  currentSort: string;

  allKoalibee: Koalibee[];
  currentKoalibeeList: Koalibee[];

  constructor(
    public ms: NgbModal,
    public as: AuthService,
    public ads: AdminService,
    public sb: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.ads.getAllKoalibees()
      .subscribe((response: HttpResponse<Koalibee[]>) => {
        this.allKoalibee = response.body;
        this.currentKoalibeeList = this.allKoalibee.slice(0, 5);
        this.currentPage = 1;
        this.numberOfPages = this.allKoalibee.length !== 0 ? Math.floor((this.allKoalibee.length - 1) / 5) + 1 : 1;
        this.sortById();
      }, (error: HttpErrorResponse) => {
        console.error(error.status + ' ' + error.message);
        this.error = true;
        if (error.status === 417) {
          this.as.setKoalibeeId(0);
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
  }

  openDelete(content: any, koalibeeId: number): void {
    this.chosenKoalibeeId = koalibeeId;
    this.ms.open(content);
  }

  deleteKoalibee(): void {
    this.ms.dismissAll();
    this.ads.deleteKoalibee(this.chosenKoalibeeId)
      .subscribe((response: HttpResponse<string>) => {
        //
      });
  }

  showSnackBarMessage(message: string, action: string, duration: number) {
    this.sb.open(
      message,
      action,
      { duration: duration }
    );
  }

  navPrev(): void {
    if (this.currentPage !== 1) {
      this.currentPage -= 1;
      this.currentKoalibeeList = this.allKoalibee.slice((this.currentPage - 1) * 5, this.currentPage * 5);
    }
  }

  navNext(): void {
    if (this.currentPage !== this.numberOfPages) {
      this.currentPage += 1;
      this.currentKoalibeeList = this.allKoalibee.slice((this.currentPage - 1) * 5, this.currentPage * 5);
    }
  }

  refreshKoalibees() {
    this.currentKoalibeeList = this.allKoalibee.slice(0, 5);
    this.currentPage = 1;
    this.numberOfPages = this.allKoalibee.length !== 0 ? Math.floor((this.allKoalibee.length - 1) / 5) + 1 : 1;
  }

  sortById() {
    //
  }

  sortByName() {
    //
  }

  sortByEmail() {
    //
  }

  sortByEta() {
    //
  }

}

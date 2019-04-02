import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  koalibeeId: number;

  constructor(
    public as: AuthService
  ) { }

  ngOnInit() {
    this.koalibeeId = this.as.getKoalibeeId();
  }

}

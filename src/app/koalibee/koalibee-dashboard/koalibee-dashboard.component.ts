import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-koalibee-dashboard',
  templateUrl: './koalibee-dashboard.component.html',
  styleUrls: ['./koalibee-dashboard.component.scss']
})
export class KoalibeeDashboardComponent implements OnInit {

  constructor(
    public router: Router,
    public as: AuthService
  ) { }

  ngOnInit() {
  }

  logoutSubmit() {
    localStorage.clear();
    this.as.setKoalibeeId(null);
    this.router.navigate(['/']);
  }

}

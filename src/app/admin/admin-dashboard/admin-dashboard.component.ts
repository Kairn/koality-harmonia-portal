import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

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

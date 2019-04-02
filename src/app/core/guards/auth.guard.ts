import { Injectable } from '@angular/core';
import {
  Route,
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  CanLoad
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    public router: Router,
    public as: AuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (state.url.includes('admin')) {
      if (this.as.getKoalibeeId() === -777) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else if (state.url.includes('koalibee')) {
      if (this.as.getKoalibeeId() > 0) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.canActivate(next, state);
  }

  canLoad(
    route: Route
  ): boolean {
    if (route.path.includes('admin')) {
      if (this.as.getKoalibeeId() === -777) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else if (route.path.includes('koalibee')) {
      if (this.as.getKoalibeeId() > 0) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}

import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AllowGuardService implements CanActivate {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.afAuth.authState.map((auth) =>  {
        if (auth !== null) {
          this.router.navigate(['user']);
          return false;
        } else {
          return true;
        }
      });
  }
}

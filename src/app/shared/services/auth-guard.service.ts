import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router
  ) {
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
      const url = state.url;
      return this.afAuth.authState.map((auth) =>  {
        return this.checkLogin(url, auth);
        });
    }

    checkLogin(url: string, auth: any): boolean {
     if (auth !== null) {
       return true;
     } else {
       this.authService.redirectUrl = url;
       this.router.navigate(['login']);
       return false;
     }
    }
}

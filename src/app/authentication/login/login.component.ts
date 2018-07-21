import { Subscription } from 'rxjs/Subscription';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { BannerService } from '../../shared/services/banner.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  @Input() modal = false; // login component in modal
  socialErrorMessage: string;

  private subscription: Subscription;

  constructor(
    private afAuth: AngularFireAuth,
    private bannerService: BannerService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  modalSignup() {
    this.bannerService.showLogin.next(false);
    this.bannerService.showSignup.next(true);
  }


  googleLogin() {
    this.authService.googleLogin();
    this.getMessage();
  }

  facebookLogin() {
    this.authService.facebookLogin();
    this.getMessage();
  }

  getMessage() {
    this.subscription = this.authService.socialErrorMessage.subscribe((message) => {
      if (message !== '') {
        this.socialErrorMessage = message;
      } else {
        this.socialErrorMessage = '';
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}

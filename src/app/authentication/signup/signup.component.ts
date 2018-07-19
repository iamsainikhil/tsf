import { Subscription } from 'rxjs/Subscription';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../../shared/services/auth.service';
import { BannerService } from './../../shared/services/banner.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  @Input() modal = false;
  errorMessage: string;

  verifyMessage: boolean;

  private subscription: Subscription;

  constructor(
    private bannerService: BannerService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  onSubmit(data) {
    const name = data.value.name;
    const email = data.value.email;
    const password = data.value.password;
    this.authService.emailSignUp(name, email, password);
    // error
    this.subscription = this.authService.signupErrorMessage.subscribe((message) => {
      if (message !== '') {
        this.errorMessage = message;
        // just to let users know about the verification email message
        if (this.errorMessage === 'email') {
          this.verifyMessage = true;
        } else {
          this.verifyMessage = false;
        }
      } else {
        this.errorMessage = null;
      }
    });
  }

  modalLogin() {
    this.authService.signupErrorMessage.next('');
    this.bannerService.showSignup.next(false);
    this.bannerService.showLogin.next(true);
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}

import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit, OnDestroy {

  errorMessage = '';
  verifyAccountMessage = '';
  resendLinkMessage = '';
  showCheck: boolean;

  showForgotPasswordForm = false;

  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit(data) {
    const email = data.value.email;
    const password = data.value.password;
    this.authService.emailLogin(email, password);
    this.loginAfterEvents();
  }

  showFP() {
    if (this.showForgotPasswordForm) {
      this.showForgotPasswordForm = false;
    } else {
      this.showForgotPasswordForm = true;
    }
  }

  verifyEmail() {
    this.authService.sendVerificationEmail();
    this.subscription = this.authService.resendLinkMessage.subscribe((message) => {
      if (message !== '') {
        this.resendLinkMessage = message;
      } else {
        this.resendLinkMessage = '';
      }
    });
  }

  loginAfterEvents() {
    const subscriptionOne = this.authService.loginErrorMessage.subscribe((message) => {
      if (message !== '') {
        this.errorMessage = 'Invalid email or password!';
      } else {
        this.errorMessage = '';
      }
    });

    const subscriptionTwo = this.authService.verifyAccountMessage.subscribe((res) => {
      if (res !== '') {
        this.verifyAccountMessage = `${res}'. Please, refresh the page if you have already verified and unable to login.'`;
      } else {
        this.verifyAccountMessage = '';
      }
    });

    if (this.subscription !== undefined) {
      this.subscription.add(subscriptionOne);
      this.subscription.add(subscriptionTwo);
    }
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}

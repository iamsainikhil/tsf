import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  message: boolean;
  resetPasswordMessage = '';
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(data) {
    this.authService.resetPassword(data.value.email);
    this.authService.resetPasswordMessage.subscribe((message) => {
      if (message !== '') {
        if (message === 'reset') {
          this.resetPasswordMessage = 'A link has been sent to your email to reset your password!';
        } else {
          this.resetPasswordMessage = message;
        }
      } else {
        this.resetPasswordMessage = '';
      }
    });
  }

}

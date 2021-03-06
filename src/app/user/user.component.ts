import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../shared/services/auth.service';
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  showLoader = true;
  userData: any;

  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.authService.logged.subscribe((condition) => {
      if (condition) {
        const userId = this.authService.currentUserId;
        this.getUserData(userId);
      }
    });
  }

  getUserData(id) {
    this.subscription = this.commonService.getDocumentData('users', id)
    .subscribe(() => {
      this.userData = this.commonService.getDocumentData('users', id);
      this.showLoader = false;
    });
  }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

}

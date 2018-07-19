import { Component, Input, OnInit, HostListener } from '@angular/core';
import { BannerService } from '../../services/banner.service';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  showLogin: boolean;
  showSignup: boolean;

  @Input() content: string = null;


  constructor(
    private bannerService: BannerService
  ) { }

  ngOnInit() {
    // if user not loggedIn events
    this.bannerService.showLogin.subscribe((login) => {
      this.showLogin = login;
    });
    this.bannerService.showSignup.subscribe((signup) => {
      this.showSignup = signup;
    });
  }

  onClose() {
   this.bannerService.showModal.next(false);
   // just to make login & signup conditions to revert to original condition
   this.bannerService.showLogin.next(true);
   this.bannerService.showSignup.next(false);
  }

  // detect clicks on the document and closes modal when clicked outside of it.
  detectClick(e) {
    this.onClose();
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Ip } from '../../models/ip';
import { CurrencyService } from '../../services/currency.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events-service';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css']
})
export class SiteHeaderComponent implements OnInit {

  loggedIn: boolean;
  userData: any;
  userName: string;
  userAvatar = '';
  iconClick = false;

  selectedCurrency = 'USD';
  cartNumber: number;

  showHeader = true; // to hide/show header while user scrolls
  animateHeader = false;

  constructor(
    private currencyService: CurrencyService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private cartService: CartService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currencyService.currencyChange.subscribe(res => {
      this.selectedCurrency = res;
    });

    this.getLocation();

    this.cartService.cartNumber.subscribe(res => {
      const cartUpdate = res;
      if (cartUpdate) {
        if (localStorage.getItem('cart')) {
          const data = JSON.parse(localStorage.getItem('cart'));
          const q = [];
          for (const i in data) {
            if (data.length !== 0) {
              q.push(data[i].q);
              this.cartNumber = q.reduce((a, b) => a + b, 0);
            } else {
              this.cartNumber = 0;
            }
          }
        } else {
          this.cartNumber = 0;
        }
      }
    });

    this.authService.logged.subscribe((condition) => {
      if (condition) {
        this.userName = this.authService.authState.displayName;
        const url = this.authService.authState.photoURL;
        if (url !== null) {
          this.userAvatar = url;
        } else {
          this.userAvatar = '';
        }
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });

  }

  menuIconClick() {
    if (this.iconClick === true) {
      this.iconClick = false;
    } else {
      this.iconClick = true;
    }
    this.googleAnalyticsEventsService.emitEvent('mobile-menu', 'menu-icon', 'cross');
  }

  mobileLinksClick(name) {
    if (this.iconClick === true) {
      this.iconClick = false;
    } else {
      this.iconClick = true;
    }
    this.googleAnalyticsEventsService.emitEvent('header-links', name, 'link');
  }

  desktopLinksClick(name) {
    this.googleAnalyticsEventsService.emitEvent('header-links', name, 'link');
  }

  mobileLogoClick() {
    this.iconClick = false;
    this.googleAnalyticsEventsService.emitEvent('mobile-logo', 'logo-click', 'link');
  }

  setCurrency() {
    this.googleAnalyticsEventsService.emitEvent('country', 'countryChangeSelectHeader', 'currency', 10);
    this.currencyService.currencyChange.next(this.selectedCurrency);
  }

  // post auth events
  logout() {
    this.iconClick = false;
    this.authService.signOut();
  }

  getLocation() {
    this.http.get('https://ipinfo.io').subscribe(
      (res: Ip) => {
        if (res.country === 'IN') {
          this.currencyService.currencyChange.next('INR');
        } else if (res.country === 'AU') {
          this.currencyService.currencyChange.next('AUD');
        } else if (res.country === 'GB') {
          this.currencyService.currencyChange.next('GBP');
        } else {
          this.currencyService.currencyChange.next('USD');
        }
      },
      (err) => {
        this.currencyService.currencyChange.next('USD');
      }
    );
  }

   // show header when user scrolls up
   getPosition(e) {
    if (e === 'up') {
      this.showHeader = true;
      this.animateHeader = true;
    } else if (e === 'zero') {
      this.showHeader = true;
      this.animateHeader = false;
    } else {
      this.showHeader = false;
      this.animateHeader = false;
    }
  }

}

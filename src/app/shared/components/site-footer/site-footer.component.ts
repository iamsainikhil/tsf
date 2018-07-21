import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events-service';


@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css']
})
export class SiteFooterComponent implements OnInit {

  loggedIn: boolean;
  userName: string;
  userAvatar = '';

  selectedCurrency = 'USD';

  information = [
    {
      name: 'Frequently Asked Questions',
      url: 'frequently-asked-questions'
    },
    {
      name: 'Privacy Policy',
      url: 'privacy-policy'
    },
    {
      name: 'Terms Of Service',
      url: 'terms'
    },
    {
      name: 'Disclaimer',
      url: 'disclaimer'
    },
  ];
  categories = ['sweets', 'savories', 'pickles', 'powders', 'flavors'];
  contact = ['about', 'contact'];

  cartNumber: number;

  constructor(
    private currencyService: CurrencyService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currencyService.currencyChange.subscribe(res => {
      this.selectedCurrency = res;
    });

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

  setCurrency() {
    this.googleAnalyticsEventsService.emitEvent('country', 'countryChangeSelectFooter', 'currency');
    this.currencyService.currencyChange.next(this.selectedCurrency);
  }

  informationItemClick(i) {
    const name = this.information[i].name;
    this.googleAnalyticsEventsService.emitEvent('footer-links', name, 'link');
  }

  categoryItemClick(i) {
    const name = this.categories[i];
    this.googleAnalyticsEventsService.emitEvent('footer-links', name, 'link');
  }

  featuresItemClick(name) {
    this.googleAnalyticsEventsService.emitEvent('footer-links', name, 'link');
  }

  contactItemClick(i) {
    const name = this.contact[i];
    this.googleAnalyticsEventsService.emitEvent('footer-links', name, 'link');
  }

  logout() {
    this.authService.signOut();
  }

}

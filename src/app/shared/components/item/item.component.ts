import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { AuthService } from '../../services/auth.service';
import { BannerService } from '../../services/banner.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events-service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  loggedIn: boolean;

  @Input() itemData: any;
  selectedCurrency: string;
  @Input() showLoader: boolean;
  addedCartText = false;
  showButtonLoader = false;

  // wishlist logic
  showModal: boolean;
  addedWishlistText = false;

  constructor(
    private currencyService: CurrencyService,
    private cartService: CartService,
    private localStorageServcice: LocalStorageService,
    private router: Router,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private bannerService: BannerService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currencyService.currencyChange.subscribe(res => {
      this.selectedCurrency = res;
    });

    this.authService.logged.subscribe((condition) => {
      this.loggedIn = condition;
    });
  }

  addCart(data) {
    this.showButtonLoader = true;
    this.localStorageServcice.storeCartData(data, 'cart');
    this.localStorageServcice.storeCartData(data, 'cartCopy');
    this.cartService.cartChange.next(true);
    this.cartService.cartNumber.next(true);

    this.googleAnalyticsEventsService.emitEvent('add-to-cart-item-page', data.name, 'button');

    this.cartButtonUpdate();
  }

  // to change button text and functionality
  cartButtonUpdate() {
    setTimeout(() => {
      this.showButtonLoader = false;
      this.addedCartText = true;
    }, 500);
  }

  viewCart(name) {
    this.router.navigateByUrl('/cart');
    this.googleAnalyticsEventsService.emitEvent('view-cart', name, 'button');
  }

  addWishlist() {
    if (this.loggedIn) {
      this.wishlistButtonUpdate();
    } else {
      this.bannerService.showModal.subscribe((condition) => {
        this.showModal = condition;
      });
      if (!this.showModal) {
        this.showModal = true;
      }
    }
  }

  wishlistButtonUpdate() {
    this.addedWishlistText = true;
  }

  viewWishlist(data) {
    this.router.navigateByUrl('/wishlist');
    this.googleAnalyticsEventsService.emitEvent('view-wishlist', data.name, 'button');
  }

}

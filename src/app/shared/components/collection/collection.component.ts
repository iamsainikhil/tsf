import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { CurrencyService } from '../../services/currency.service';
import { GoogleAnalyticsEventsService } from '../../services/google-analytics-events-service';
import { AuthService } from '../../services/auth.service';
import { BannerService } from '../../services/banner.service';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  loggedIn: boolean;

  @Input() collectionName: string;
  @Input() collectionData: any;
  @Input() showLoader: boolean;
  @Input() category = false;
  selectedCurrency: string;
  cartIndex: number;
  cartIndexAdded = [];
  addedCartText = false;
  showButtonLoader = false;

  // wishlist logic
  showModal: boolean;
  wishlistIndex: number;
  wishlistIndexAdded = [];
  addedWishlistText = false;



  constructor(
    private currencyService: CurrencyService,
    private commonService: CommonService,
    private cartService: CartService,
    private localStorageServcice: LocalStorageService,
    private router: Router,
    private bannerService: BannerService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
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

  addCart(itemId, collectionname, i) {
    this.showButtonLoader = true;
    const data = {
      id: itemId,
      n: collectionname,
      q: 1
    };
    this.localStorageServcice.storeCartData(data, 'cart');
    this.cartService.cartChange.next(true);
    this.cartService.cartNumber.next(true);

    this.googleAnalyticsEventsService.emitEvent('add-to-cart', itemId, 'button');


    this.cartButtonUpdate(i);
  }

  // to change button text and functionality
  cartButtonUpdate(i) {
    this.cartIndex = i;
    this.cartIndexAdded.push(i);
    setTimeout(() => {
      this.showButtonLoader = false;
      this.addedCartText = true;
    }, 500);
  }

  viewCart(name) {
    this.router.navigateByUrl('/cart');
    this.googleAnalyticsEventsService.emitEvent('view-cart', name, 'button');
  }

  addWishlist(i) {
    if (this.loggedIn) {
      this.wishlistButtonUpdate(i);
    } else {
      this.authService.redirectUrl = '/wishlist';
      this.bannerService.showModal.subscribe((condition) => {
        this.showModal = condition;
      });
      if (!this.showModal) {
        this.showModal = true;
      }
    }
  }

  wishlistButtonUpdate(i) {
    this.wishlistIndex = i;
    this.wishlistIndexAdded.push(i);
    this.addedWishlistText = true;
  }

  viewWishlist(i, data) {
    this.router.navigateByUrl('/wishlist');
    this.googleAnalyticsEventsService.emitEvent('view-wishlist', data.name, 'button');
  }

}

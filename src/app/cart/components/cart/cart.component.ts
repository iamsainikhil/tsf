import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../shared/services/cart.service';
import { LocalStorageService } from '../../../shared/services/localStorage.service';
import { BannerService } from './../../../shared/services/banner.service';
import { GoogleAnalyticsEventsService } from './../../../shared/services/google-analytics-events-service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  // login / signup [wishlist]
  showModal: boolean;
  wishlistIndex: number;
  wishlistIndexAdded = [];
  addedWishlistText = false;

  @Input() selectedCurrency: string;
  @Input() cartData: any;
  @Input() itemsPriceData: any;
  @Input() quantityData: any;
  @Input() totalQuantity: number;
  @Output() quantityIndex: EventEmitter<object> = new EventEmitter();

  constructor(
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private router: Router,
    private bannerService: BannerService
  ) { }

  ngOnInit() {
  }

  updateQuantity(i, data, name) {
    if (name === 'decrement') {
      if (this.quantityData[i] !== 0 && this.quantityData[i] > 1) {
        this.quantityData[i] = this.quantityData[i] - 1;
      } else {
        this.quantityData[i] = 1;
      }
    } else {
      if (this.quantityData[i] !== 0 && this.quantityData[i] < 25) {
        if (this.totalQuantity === 25) {
          this.quantityData[i] = this.quantityData[i];
        } else {
          this.quantityData[i] = this.quantityData[i] + 1;
        }
      } else if (this.quantityData[i] === 25) {
        this.quantityData[i] = 25;
        alert('maximum item quantity');
      } else {
        this.quantityData[i] = 1;
      }
    }
    this.quantityIndex.emit({
      q: this.quantityData[i],
      i: i
    });
    this.cartService.cartNumber.next(true);
    this.googleAnalyticsEventsService.emitEvent(`item-quantity-${name}`, data.name, 'plus-minus');
  }

  removeItem(i, data) {
    this.localStorageService.removeCart(i, 'cartCopy');
    this.localStorageService.removeCart(i, 'cart');
    this.cartService.cartChange.next(true);
    this.cartService.cartNumber.next(true);
    this.googleAnalyticsEventsService.emitEvent('remove-from-cart', data.name, 'select');
  }

  continueShopping() {
    this.googleAnalyticsEventsService.emitEvent('continue-shopping', 'button-click', 'button');
    this.router.navigateByUrl('/shop');
  }

  addWishlist(i) {
    this.bannerService.showModal.subscribe((condition) => {
        this.showModal = condition;
    });
    if (!this.showModal) {
      this.showModal = true;
    }
    // this.wishlistButtonUpdate(i);
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

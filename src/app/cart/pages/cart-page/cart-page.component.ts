import { Component, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { CartService } from '../../../shared/services/cart.service';
import { CommonService } from '../../../shared/services/common.service';
import { CurrencyService } from '../../../shared/services/currency.service';
import { LocalStorageService } from '../../../shared/services/localStorage.service';
import { GoogleAnalyticsEventsService } from './../../../shared/services/google-analytics-events-service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {

  cartEmpty = false;
  @Output() showLoader = true;
  @Output() itemsDataObservable = [];
  itemsId = [];
  itemsData = [];
  itemsDataCopy = [];
  private cart = [];
  private shippingPriceCurrency: number;

  @Output() quantity = [];
  @Output() itemPrice = [];
  @Output() selectedCurrency: string;
  @Output() totalQuantity: number;
  @Output() subTotalPrice: number;
  @Output() shippingPrice = {
    aus: 0,
    india: 0,
    uk: 0,
    us: 0
  };
  @Output() totalPrice: number;

  constructor(
    private afs: AngularFirestore,
    private currencyService: CurrencyService,
    private cartService: CartService,
    private commonService: CommonService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService
  ) { }

  ngOnInit() {
    this.currencyService.currencyChange.subscribe(res => {
      this.selectedCurrency = res;
      this.getPriceArray();
    });

    /**
     * To always listen to cartUpdate changes and update the cart
     */
    this.cartService.cartChange.subscribe(res => {
      const cartUpdate = res;
      if (cartUpdate) {
        if (localStorage.getItem('cart')) {
          this.cart = this.localStorageService.getCartData('cart');
          if (!Array.isArray(this.cart) || this.cart.length === 0) {
            // array does not exist, is not an array, or is empty
            this.cartEmpty = true; // to display error cart empty image
            localStorage.removeItem('cart');
          } else {
            this.getItemData();
          }
        } else {
          this.cartEmpty = true;
          localStorage.removeItem('cart');
        }
      }
    });

  }

  /**
   * e = {q: quantity, i: id} from cart component
   */
  getIndex(e) {
    this.getPrice(e);
  }

  /**
   * get itemData
   */
  getItemData() {
    for (const i in this.cart) {
      if (this.cart.length !== 0) {
        if (this.itemsData.length !== 0 && this.itemsData.length < this.cart.length) {
            if (this.itemsId[i] !== this.cart[i].id) {
              // runs to fetch doc data for the id that doesn't already fetched in itemsData
              // this loop reduces firestore read operations
              this.afs.doc(this.cart[i].n + '/' + this.cart[i].id).ref.get()
              .then((doc) => {
                if (doc.exists) {
                  this.itemsData.push(doc.data());
                  this.itemsId.push(this.cart[i].id);
                  this.itemsDataCopy = JSON.parse(JSON.stringify(this.itemsData));
                  const data = this.afs.doc(this.cart[i].n + '/' + this.cart[i].id).valueChanges();
                  this.itemsDataObservable.push(data);
                  this.cleverPrice();
                  this.showLoader = false;
                } else {
                  this.localStorageService.removeCart(i, 'cart');
                }
              }).catch((error) => {
                  this.localStorageService.removeCart(i, 'cart');
              });
            }
        } else if (this.itemsData.length === 0) {
          this.afs.doc(this.cart[i].n + '/' + this.cart[i].id).ref.get()
          .then((doc) => {
            if (doc.exists) {
              this.itemsData.push(doc.data());
              this.itemsId.push(this.cart[i].id);
              this.itemsDataCopy = JSON.parse(JSON.stringify(this.itemsData));
              const data = this.afs.doc(this.cart[i].n + '/' + this.cart[i].id).valueChanges();
              this.itemsDataObservable.push(data);
              this.cleverPrice();
              this.showLoader = false;
            } else {
              this.localStorageService.removeCart(i, 'cart');
            }
          }).catch((error) => {
              this.localStorageService.removeCart(i, 'cart');
          });
        } else if (this.itemsData.length > this.cart.length) {
           for (const j in this.itemsData) {
              if (typeof(this.cart[j]) === 'object') {
                // runs when last item of itemsData is not removed
                if (this.itemsId[j] !== this.cart[j].id) {
                  this.itemsId.splice(Number(j), 1);
                  this.itemsData.splice(Number(j), 1);
                  this.itemsDataCopy.splice(Number(j), 1);
                  this.itemsDataObservable.splice(Number(j), 1);
                  this.getPriceArray();
                  break;
                } else {
                  // console.log('keep', this.itemsId[j]);
                }
              } else {
                // runs when last item of itemsData is removed
                this.itemsId.splice(Number(j), 1);
                this.itemsData.splice(Number(j), 1);
                this.itemsDataCopy.splice(Number(j), 1);
                this.itemsDataObservable.splice(Number(j), 1);
                this.getPriceArray();
                break;
              }
            }
          }
        }
      }
  }

  /**
   *
   * @param quantityIndex
   * index of the cart array and quantity
   */
  getPrice(qI) {
    const i = qI.i;
    const n = qI.q;
    this.quantity[i] = n;
    this.cart[i].q = n;
    this.itemsDataCopy[i].price.india = this.itemsData[i].price.india * n;
    this.itemsDataCopy[i].price.us = this.itemsData[i].price.us * n;
    this.itemsDataCopy[i].price.aus = this.itemsData[i].price.aus * n;
    this.itemsDataCopy[i].price.uk = this.itemsData[i].price.uk * n;

    localStorage.removeItem('cart');
    for (const index in this.cart) {
      if (this.cart.length !== 0) {
        this.localStorageService.storeCartData(this.cart[index], 'cart');
      }
    }
    // pass the latest cart array to the below function
    this.getPriceArray();
  }

  /**
   * This function is created to update price with respect to quantity of an item
   */
  cleverPrice() {
    for (const i in this.itemsData) {
      if (this.cart[i].q >= 1) {
        const n = this.cart[i].q;
        this.itemsDataCopy[i].price.india = this.itemsData[i].price.india * n;
        this.itemsDataCopy[i].price.us = this.itemsData[i].price.us * n;
        this.itemsDataCopy[i].price.aus = this.itemsData[i].price.aus * n;
        this.itemsDataCopy[i].price.uk = this.itemsData[i].price.uk * n;
      } else {
        this.cart[i].q = 1;
        this.localStorageService.removeCart(i, 'cart');
        this.localStorageService.storeCartData(this.cart[i], 'cart');
        this.itemsDataCopy[i].price.india = this.itemsData[i].price.india;
        this.itemsDataCopy[i].price.us = this.itemsData[i].price.us;
        this.itemsDataCopy[i].price.aus = this.itemsData[i].price.aus;
        this.itemsDataCopy[i].price.uk = this.itemsData[i].price.uk;
      }
    }
    this.getPriceArray();
}


  /**
   * To prepare an array of prices in one currency to calculate subTotalPrice & totalPrice
   */
  getPriceArray() {
    this.itemPrice = []; // set price array to null
    if (this.itemsData.length !== 0) {
      for (const i in this.itemsData) {
        if (this.cart.length !== 0) {
          if (this.selectedCurrency === 'INR') {
            this.itemPrice.push(this.itemsDataCopy[i].price.india);
          } else if (this.selectedCurrency === 'USD') {
            this.itemPrice.push(this.itemsDataCopy[i].price.us);
          } else if (this.selectedCurrency === 'AUD') {
            this.itemPrice.push(this.itemsDataCopy[i].price.aus);
          } else {
            this.itemPrice.push(this.itemsDataCopy[i].price.uk);
          }
        } else {
          return ;
        }
      }
      // calculate subTotalPrice and TotalPrice
      this.getSubTotal(this.itemPrice);
    }
  }

  getSubTotal(priceArray) {
    this.subTotalPrice = priceArray.reduce((a, b) => a + b, 0);
    this.getQuantity();
  }

  getQuantity() {
    this.quantity = [];
    if (this.itemsData.length !== 0) {
      for (const i in this.itemsData) {
        if (this.cart.length !== 0) {
          this.quantity.push(this.cart[i].q);
        }
      }
      this.totalQuantity = this.quantity.reduce((a, b) => a + b, 0);
      this.getShippingPrice(this.totalQuantity);
    }
  }

  getShippingPrice(quantity: number) {
    if (quantity <= 4) {
      this.shippingPrice = {
        aus: 0,
        india: 0,
        uk: 0,
        us: 0
      };
    } else if (quantity >= 5) {
      this.shippingPrice = {
        aus: 70,
        india: 3500,
        uk: 40,
        us: 50
      };
    }
    if (this.selectedCurrency === 'INR') {
      this.shippingPriceCurrency = this.shippingPrice.india;
    } else if (this.selectedCurrency === 'USD') {
      this.shippingPriceCurrency = this.shippingPrice.us;
    } else if (this.selectedCurrency === 'AUD') {
      this.shippingPriceCurrency = this.shippingPrice.aus;
    } else {
      this.shippingPriceCurrency = this.shippingPrice.uk;
    }
    this.getTotal();
  }

  getTotal() {
    this.totalPrice = this.subTotalPrice + this.shippingPriceCurrency;
  }

  continueShopping() {
    this.googleAnalyticsEventsService.emitEvent('shop-empty-cart', 'button-click', 'button');
    this.router.navigateByUrl('/shop');
  }

}

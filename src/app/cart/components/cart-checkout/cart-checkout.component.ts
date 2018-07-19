import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-checkout',
  templateUrl: './cart-checkout.component.html',
  styleUrls: ['./cart-checkout.component.css']
})
export class CartCheckoutComponent implements OnInit {

  @Input() data: any;
  @Input() itemsPriceData: any;
  @Input() quantityData: any;
  @Input() selectedCurrency: string;
  @Input() totalQuantity: number;
  @Input() subTotalPrice: number;
  @Input() shippingPrice: number;
  @Input() totalPrice: number;

  constructor() { }

  ngOnInit() {
  }

}

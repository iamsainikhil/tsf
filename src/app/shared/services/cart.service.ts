import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CartService {
    /**
   * Stream to announce cart changes
   * @type {BehaviorSubject<string>}
   */
    public cartChange = new BehaviorSubject<boolean>(true);

    // to update the cart number on site-header & footer
    public cartNumber = new BehaviorSubject<boolean>(true);
}

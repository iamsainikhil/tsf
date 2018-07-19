import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CurrencyService {
    /**
   * Stream to announce currency changes based on country selection
   * @type {BehaviorSubject<string>}
   */
  public currencyChange = new BehaviorSubject<string>('USD');
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(data: any, currency: string): any {
    let value: any;
    if (currency === 'INR') {
      value = data.india;
    } else if (currency === 'USD') {
      value = data.us;
    } else if (currency === 'AUD') {
      value = data.aus;
    } else {
      value = data.uk;
    }
    return value;
  }

}

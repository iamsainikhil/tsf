import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    cartArray: any;
        // store cart array
    public storeCartData(data, name) {
        if (localStorage.getItem(name)) {
            this.cartArray = JSON.parse(localStorage.getItem(name));
            // check whether the data already exists in cartArray
           if (this.dataExists(data, this.cartArray)) {
            //    console.log('duplicate data found');
           } else {
               this.cartArray.push(data);
               localStorage.setItem(name, JSON.stringify(this.cartArray));
           }
        } else {
            if (Object.keys(data).length !== 0) {
                // here data is an object which comes from other components
                this.cartArray = [];
                this.cartArray.push(data);
                localStorage.setItem(name, JSON.stringify(this.cartArray));
            } else {
                // here data is already an array which comes from cartPage
                localStorage.setItem(name, JSON.stringify(data));
            }
        }
    }

    private dataExists(data, dataArray) {
        for (const i in dataArray) {
            if (dataArray[i].id === data.id) {
                return true;
            }
        }
    }

    public getCartData(name) {
        try {
            return JSON.parse(localStorage.getItem(name)); // returns array
        } catch (error) {
            // console.log(error);
        }
    }

    public removeCart(i, name) {
        if (localStorage.getItem(name)) {
            const cartArray = JSON.parse(localStorage.getItem(name));
            cartArray.splice(i, 1);
            localStorage.setItem(name, JSON.stringify(cartArray));
        }
    }

}


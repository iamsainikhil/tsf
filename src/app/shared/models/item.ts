import { Price } from './price';

/**
 * Models the get item details from firestore
 */
export class Item {
    name: string;
    imageUrl: string;
    price: Price;
    date?: any;
}

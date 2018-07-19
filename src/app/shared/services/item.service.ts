import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Item } from '../models/item';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ItemService {

    itemDoc: AngularFirestoreDocument<Item>;

    itemData: Observable<any>;

    constructor(private afs: AngularFirestore) {}

    /**
     * get data for an item in a specified collection
     */
    getItemData(collectionName: string, itemId: string) {
        this.itemData = this.afs.collection(collectionName).doc(itemId).valueChanges();

        return this.itemData;
    }
}

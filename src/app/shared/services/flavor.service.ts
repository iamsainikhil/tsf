import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Item } from '../models/item';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FlavorService {

    flavorCollection: AngularFirestoreCollection<Item>;

    flavorData: Observable<any[]>;

    constructor(private afs: AngularFirestore) {
        this.flavorCollection = afs.collection('flavors');
    }

    /**
     * get data from sweets collection
     */
    getFlavorsData() {
        this.flavorData = this.flavorCollection.snapshotChanges().map(changes => {
            return changes.map(a => {
              const data = a.payload.doc.data() as Item;
              const id = a.payload.doc.id;
              return {id, data};
            });
        });
        return this.flavorData;
    }

     /**
     * Get limited data from projects collection in firestore
     */
    getLimitedFlavorsData(number) {
        const flavorCollection =  this.afs.collection<Item>('flavors', ref => ref.limit(number));
        this.flavorData = flavorCollection.snapshotChanges().map(changes => {
            return changes.map(a => {
              const data = a.payload.doc.data() as Item;
              const id = a.payload.doc.id;
              return {id, data};
            });
        });
        return this.flavorData;
    }
}

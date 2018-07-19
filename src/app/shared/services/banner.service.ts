import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Item } from '../models/item';

@Injectable()
export class BannerService {

    bannerCollection: AngularFirestoreCollection<Item>;
    bannerData: Observable<any[]>;

    /**
     * modal dialog logic
     */
    showModal = new BehaviorSubject<boolean>(true);
    showLogin = new BehaviorSubject<boolean>(true);
    showSignup = new BehaviorSubject<boolean>(false);

    constructor(private afs: AngularFirestore) {
        this.bannerCollection = afs.collection('banners');
    }

    /**
     * get data from sweets collection
     */
    getBannersData() {
        this.bannerData = this.bannerCollection.valueChanges();
        return this.bannerData;
    }
}

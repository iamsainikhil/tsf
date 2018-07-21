import { CartService } from './shared/services/cart.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { PageScrollConfig } from 'ngx-page-scroll';
import 'rxjs/add/operator/distinctUntilChanged';
import { environment } from '../environments/environment';
import { GoogleAnalyticsEventsService } from './shared/services/google-analytics-events-service';
import { NgwWowService } from 'ngx-wow';

declare let gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  analyticsId = environment.analyticsId;
  /**
   * To know whether the user device is connected online
   */
  public isConnected: boolean = navigator.onLine;

  cartNumber: number;

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private cartService: CartService,
    private wowService: NgwWowService
  ) {

    this.afs.firestore.settings({ timestampsInSnapshots: true });
    /**
     * To detect web status
     */
    window.addEventListener('online', () => {this.isConnected = true; });
    window.addEventListener('offline', () => {this.isConnected = false; });

    /**
     * overriding default options for ng-page-scroll
     */
    PageScrollConfig.defaultScrollOffset = 0;
    PageScrollConfig.defaultEasingLogic = {
        ease: (t: number, b: number, c: number, d: number): number => {
            // easeInOutExpo easing
            if (t === 0) { return b; }
            if (t === d) { return b + c; }
            if ((t /= d / 2) < 1) { return c / 2 * Math.pow(2, 10 * (t - 1)) + b; }
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    };
  }

  ngOnInit() {
    this.router.events.distinctUntilChanged((previous: any, current: any) => {
      // Subscribe to any `NavigationEnd` events where the url has changed
      if (current instanceof NavigationEnd) {
          return previous.url === current.url;
      }
      return true;
  }).subscribe((x: any) => {
      gtag('config', this.analyticsId , {'page_path': x.url});
  });


    this.router.events.subscribe((event: NavigationEnd) => {
      if (event.url === '/cart') {
        this.cartNumber = 0;
      } else {
        // show/hide floating cart icon
        this.cartService.cartNumber.subscribe(res => {
          if (res) {
            if (localStorage.getItem('cart')) {
              const data = JSON.parse(localStorage.getItem('cart'));
              const q = [];
              for (const i in data) {
                if (data.length !== 0) {
                  q.push(data[i].q);
                  this.cartNumber = q.reduce((a, b) => a + b, 0);
                } else {
                  this.cartNumber = 0;
                }
              }
            } else {
              this.cartNumber = 0;
            }
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    this.wowService.init();
  }

  onDeactivate() {
    window.scrollTo(0, 0);
  }

  cartClick() {
    this.router.navigate(['cart']);
    this.googleAnalyticsEventsService.emitEvent('floatingCart', 'click', 'redirectCart', 10);
  }
}

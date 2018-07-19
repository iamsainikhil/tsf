import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAnalyticsEventsService } from './../../../shared/services/google-analytics-events-service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  showFilter = false;

  /**
   * filter chips
   */
  filters = [
    { name: 'sweets' },
    { name: 'savories' },
    { name: 'pickles' },
    { name: 'powders' },
    { name: 'flavors' }
  ];

  constructor(
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService,
    private router: Router
  ) {}

  ngOnInit() {}

  filterClick(name: string, i: number) {
    this.googleAnalyticsEventsService.emitEvent('filter-links', name, 'link');
    this.filters.forEach((item, index) => {
        if (index === i) {
          this.router.navigateByUrl('/' + name);
        } else {
          // do nothing
        }
    });
  }

  filterCondition(e) {
    if (e) {
      this.showFilter = true;
    }
  }
}

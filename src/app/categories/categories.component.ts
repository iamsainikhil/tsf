import { Component, OnInit, Output } from '@angular/core';
import { CommonService } from '../shared/services/common.service';
import { CurrencyService } from '../shared/services/currency.service';
import { GoogleAnalyticsEventsService } from '../shared/services/google-analytics-events-service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  showFilter = true;

  /**
   * collections data
   */
  @Output() sweetsData: any;
  @Output() savoriesData: any;
  @Output() picklesData: any;
  @Output() powdersData: any;
  @Output() flavorsData: any;

  /**
   * collections loaders
   */
  @Output() sweetsLoader = true;
  @Output() savoriesLoader = true;
  @Output() picklesLoader = true;
  @Output() powdersLoader = true;
  @Output() flavorsLoader = true;

  /**
   * category show data conditions
   */
  showSweets = true;
  showSavories = true;
  showPickles = true;
  showPowders = true;
  showFlavors = true;

  /**
   * filter chips
   */
  filters = [
    {
      name: 'show all',
      click: true
    },
    {
      name: 'sweets',
      click: false
    },
    {
      name: 'savories',
      click: false
    },
    {
      name: 'pickles',
      click: false
    },
    {
      name: 'powders',
      click: false
    },
    {
      name: 'flavors',
      click: false
    }
  ];

  constructor(
    private currencyService: CurrencyService,
    private commonService: CommonService,
    private googleAnalyticsEventsService: GoogleAnalyticsEventsService

  ) {}

  ngOnInit() {
    // fetch collection data
    this.getCollectionData('sweets');
    this.getCollectionData('savories');
    this.getCollectionData('pickles');
    this.getCollectionData('powders');
    this.getCollectionData('flavors');
  }

  /**
   * filter chip click event
   */
  filterClick(name: string, i: number) {
    this.googleAnalyticsEventsService.emitEvent('filter-links', name, 'link');
    this.filters.forEach((item, index) => {
        if (index === i) {
          this.filters[index].click = true;
        } else {
          this.filters[index].click = false;
        }
    });
    if (name === 'sweets') {
      this.showSweets = true;
      this.showSavories = false;
      this.showPickles = false;
      this.showPowders = false;
      this.showFlavors = false;
    } else if (name === 'savories') {
      this.showSweets = false;
      this.showSavories = true;
      this.showPickles = false;
      this.showPowders = false;
      this.showFlavors = false;
    } else if (name === 'pickles') {
      this.showSweets = false;
      this.showSavories = false;
      this.showPickles = true;
      this.showPowders = false;
      this.showFlavors = false;
    } else if (name === 'powders') {
      this.showSweets = false;
      this.showSavories = false;
      this.showPickles = false;
      this.showPowders = true;
      this.showFlavors = false;
    } else if (name === 'flavors') {
      this.showSweets = false;
      this.showSavories = false;
      this.showPickles = false;
      this.showPowders = false;
      this.showFlavors = true;
    } else {
      this.showSweets = true;
      this.showSavories = true;
      this.showPickles = true;
      this.showPowders = true;
      this.showFlavors = true;
    }
  }

  // collection data fetch
  getCollectionData(collectionName, opts?: any) {
    const options = {
      collectionName,
      field: null,
      reverse: true,
      limit: 10,
      ...opts
    };
    let data: any;
    if (options.field !== null) {
      this.commonService.getCollectionData(collectionName, {field: options.field, limit: options.limit}).subscribe(() => {
        data = this.commonService.getCollectionData(collectionName,
          {field: options.field, limit: options.limit});
          this.loaderOff(collectionName, data);
      });
    } else {
       // get plain collection data
      this.commonService.getCollectionData(collectionName, {limit: options.limit}).subscribe(() => {
        data = this.commonService.getCollectionData(collectionName, {limit: options.limit});
        this.loaderOff(collectionName, data);
      });
    }
  }

  loaderOff(name, data) {
    if (name === 'sweets') {
      this.sweetsLoader = false;
      this.sweetsData = data;
    } else if (name === 'savories') {
      this.savoriesLoader = false;
      this.savoriesData = data;
    } else if (name === 'pickles') {
      this.picklesLoader = false;
      this.picklesData = data;
    } else if (name === 'powders') {
      this.powdersLoader = false;
      this.powdersData = data;
    }  else {
      this.flavorsLoader = false;
      this.flavorsData = data;
    }
  }

}

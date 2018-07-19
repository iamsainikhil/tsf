import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NguCarousel } from '@ngu/carousel';
import { BannerService } from '../../services/banner.service';
import { CommonService } from './../../services/common.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  carouselOne: NguCarousel;
  bannersData: any;

  showLoader = true;

  @Output() showFilter: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private bannerService: BannerService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getBanners();
  }

  getBanners() {
    this.bannersData = this.bannerService.getBannersData();
    this.carouselOptions();
  }

  private carouselOptions() {
    this.carouselOne = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 1,
      speed: 400,
      interval: 3000,
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: center;
            position: absolute;
            z-index: 9;
            padding: 12px;
            margin: 0;
            white-space: nowrap;
            overflow: auto;
            width: 100%;
            bottom: 10px;
            left: 0;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.9);
            padding: 4px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngucarouselPoint li:hover {
            cursor: pointer;
          }
          .ngucarouselPoint li.active {
              background: white;
              width: 20px;
          }
        `
      },
      load: 1,
      touch: true,
      loop: true,
      custom: 'banner'
    };
    return this.carouselOne;
  }

  initDataFn(event) {
    if (event.token !== null) {
      // to hide loader and emit condition to show filter on home component
      setTimeout(() => {
        this.showLoader = false;
        this.showFilter.emit(true);
      }, 100);
    }
   }

}

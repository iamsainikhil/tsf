import { AuthService } from '../../../shared/services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NguCarousel } from '@ngu/carousel';
import { BannerService } from '../../../shared/services/banner.service';
import { CommonService } from '../../../shared/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent implements OnInit {

  testimonials: NguCarousel;
  testimonialsData: any;

  showLoader = true;
  showModal: boolean;

  modalContent = 'to give a feedback!';
  constructor(
    private router: Router,
    private bannerService: BannerService,
    private commonService: CommonService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getTestimonialsData();
  }

  getTestimonialsData() {
    this.testimonialOptions();
    this.commonService.getCollectionData('testimonials').subscribe(() => {
      this.testimonialsData = this.commonService.getCollectionData('testimonials');
      this.showLoader = false;
    });
  }

  private testimonialOptions() {
    this.testimonials = {
      grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
      slide: 1,
      speed: 500,
      point: {
        visible: true,
        pointStyles: `
          .ngucarouselPoint {
            list-style-type: none;
            text-align: center;
            padding: 12px;
            white-space: nowrap;
            overflow: auto;
            width: 100%;
            position: absolute;
            z-index: 10;
            margin: 0;
            bottom: -20px;
            left: 0;
            box-sizing: border-box;
          }
          .ngucarouselPoint li {
            display: inline-block;
            border-radius: 999px;
            background: #808080;
            padding: 4px;
            margin: 0 3px;
            transition: .4s ease all;
          }
          .ngucarouselPoint li:hover {
            cursor: pointer;
          }
          .ngucarouselPoint li.active {
              background: #808080;
              width: 20px;
          }
        `
      },
      load: 1,
      touch: true,
      loop: true,
      custom: 'banner'
    };
    return this.testimonials;
  }

  giveFeedback() {
    this.authService.logged.subscribe((logged) => {
      if (!logged) {
          this.bannerService.showModal.subscribe((condition) => {
          this.showModal = condition;
        });
        if (!this.showModal) {
          this.showModal = true;
        }
      } else {
        this.router.navigate(['feedback']);
      }
    });
  }

}

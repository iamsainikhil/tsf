import { Component, OnInit } from '@angular/core';
import { CommonService } from './../shared/services/common.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  showLoader = true;
  data: any;
  indexAdded = [];

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.commonService.getCollectionData('faqs').subscribe(() => {
      this.data = this.commonService.getCollectionData('faqs');
      this.showLoader = false;
    });
  }

  questionClick(i) {
    const id = i;
    if (i === id) {
      if (this.indexAdded.includes(i)) {
        // to remove item from the array at item's index
        const index = this.indexAdded[i];
        this.indexAdded.splice(index, 1);
      } else {
        this.indexAdded.push(i);
      }
    }
  }

}

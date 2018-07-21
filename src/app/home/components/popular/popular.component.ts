import { Component, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.css']
})
export class PopularComponent implements OnInit {

  @Output() title = 'popular';
  @Output() data: any;
  @Output() showLoader = true;

  // just to let collection component show item links different
  // for popular items
  @Output() category = true;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.commonService.getCollectionData('popular').subscribe(() => {
      this.data = this.commonService.getCollectionData('popular');
      this.showLoader = false;
    });
  }

}

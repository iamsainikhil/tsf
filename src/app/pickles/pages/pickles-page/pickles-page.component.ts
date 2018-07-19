import { Component, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-pickles-page',
  templateUrl: './pickles-page.component.html',
  styleUrls: ['./pickles-page.component.css']
})
export class PicklesPageComponent implements OnInit {

  @Output() collectionData: any;
  @Output() showLoader: boolean;

  constructor(private commonService: CommonService) {}

  ngOnInit() {
    this.getCollectionData('pickles');
  }

    // collection data fetch
    getCollectionData(collectionName, opts?: any) {
      const options = {
        collectionName,
        field: null,
        reverse: true,
        limit: 50,
        ...opts
      };
      if (options.field !== null) {
        this.commonService.getCollectionData(collectionName, {field: options.field, limit: options.limit}).subscribe(() => {
          this.showLoader = false;
          this.collectionData = this.commonService.getCollectionData(collectionName,
            {field: options.field, limit: options.limit});
        });
      } else {
        // get plain collection data
        this.commonService.getCollectionData(collectionName, {limit: options.limit}).subscribe(() => {
          this.showLoader = false;
          this.collectionData = this.commonService.getCollectionData(collectionName, {limit: options.limit});
        });
      }
    }
}

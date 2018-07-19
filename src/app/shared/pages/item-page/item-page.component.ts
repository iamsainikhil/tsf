import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { ItemService } from './../../services/item.service';


@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html',
  styleUrls: ['./item-page.component.css']
})

export class ItemPageComponent implements OnInit {

  itemData: any;
  showLoader = true;

  constructor(
    private route: ActivatedRoute,
    private itemService: ItemService
  ) {
  }

  ngOnInit() {
    /**
     * get collection name & item Id from url
     */
    const segments: UrlSegment[] = this.route.snapshot.url;
    const collection = segments[0].path;
    const itemId = segments[1].path;

    this.getItemData(collection, itemId);
  }

  getItemData(name, id) {
    this.itemService.getItemData(name, id).subscribe(() => {
      this.itemData = this.itemService.getItemData(name, id);
      this.showLoader = false;
    });
  }

}

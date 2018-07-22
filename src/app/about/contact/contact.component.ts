import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ContactService } from '../../shared/services/contact.service';
import { AgmMap } from '../../../../node_modules/@agm/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  revealNumber = false;
  successMessage = false;

  date = new Date();

  lat = 18.453249;
  lng = 79.117434;
  zoom = 17;

  // snazzy info window inputs
  backgroundColor = '#f5f5f5';
  borderRadius = '15px';
  maxHeight = 400;
  maxWidth = 400;
  padding = '20px 20px 0 20px';
  wrapperClass = 'custom-window';

  // to center the map coords with window resize

  @ViewChild(AgmMap) myMap: any;

  @HostListener('window:resize')
  onWindowResize() {
    this.myMap.triggerResize()
      .then(() =>  this.myMap._mapsWrapper.setCenter({lat: this.lat, lng: this.lng}));
  }

  constructor(private contactService: ContactService) { }

  ngOnInit() {
  }

  onReveal() {
    this.revealNumber = true;
  }

  showForm() {
    this.successMessage = false;
  }

  onSubmit(data) {
    this.successMessage = true;
    const contactData = {
      email: data.value.email,
      message: data.value.message,
      dateAdded: this.date
    };
    this.contactService.addData(contactData);
  }

}

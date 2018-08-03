import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AgmMap } from '../../../../node_modules/@agm/core';
import { ContactService } from '../../shared/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  legalAccept = false;

  revealNumber = false;
  successMessage = false;

  date = new Date();

  lat = 18.453249;
  lng = 79.117434;
  zoom = 17;

  // snazzy info window inputs
  openWindow = false;
  backgroundColor = '#f3f2f2';
  borderRadius = '15px';
  maxHeight = 400;
  maxWidth = 400;
  padding = '20px 10px 0 10px';

  // to center the map coords with window resize

  @ViewChild(AgmMap) myMap: any;

  @HostListener('window:resize')
  onWindowResize() {
    this.openWindow = false;
    this.myMap.triggerResize()
      .then(() => {
        this.myMap._mapsWrapper.setCenter({lat: this.lat, lng: this.lng});
        setTimeout(() => {
          this.openWindow = true;
        }, 100);
      });
  }

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.openWindow = true;
  }

  onReveal() {
    this.revealNumber = true;
  }

  showForm() {
    this.successMessage = false;
  }

  acceptLegal() {
    this.legalAccept = !this.legalAccept;
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

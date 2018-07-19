import { Component, OnInit } from '@angular/core';
import { ContactService } from './../../shared/services/contact.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  revealNumber = false;
  successMessage = false;

  date = new Date();

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

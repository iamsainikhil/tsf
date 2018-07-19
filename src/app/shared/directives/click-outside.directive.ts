import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

    @Output()
    public detectClick = new EventEmitter();
    private wasInside = true;


    constructor(private _elementRef: ElementRef) {
    }

    // clicks on element level
    @HostListener('click')
    @HostListener('touchstart')
    clickInside() {
      this.wasInside = true;
    }

    // clicks on document level
    @HostListener('document:click')
    @HostListener('document:touchstart')
    clickout() {
      if (!this.wasInside) {
          this.detectClick.emit('outside');
      }
      this.wasInside = false;
    }
}

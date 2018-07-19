import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollable]'
})
export class ScrollableDirective {

  @Output() scrollPosition = new EventEmitter();
  @Output() scrollDirection = new EventEmitter();
  lastScrollTop = window.pageYOffset ||  document.documentElement.scrollTop;

  constructor(public el: ElementRef) { }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    try {
      const top = event.target.documentElement.scrollTop;
      const height = event.target.documentElement.scrollHeight;
      const offset = event.target.documentElement.offsetHeight;


      const currentScroll = window.pageYOffset ||  top;

      // to show/hide header

      setTimeout(() => {
        if (currentScroll > this.lastScrollTop && currentScroll  > 25) {
          this.scrollDirection.emit('down');
        } else if (currentScroll === this.lastScrollTop) {
          // do nothing
        } else if (currentScroll <= 25) {
          this.scrollDirection.emit('zero');
        } else {
          this.scrollDirection.emit('up');
        }
        this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
      }, 250);

      // to show/hide scrollTop icon

      // emit bottom event
      if ( top > height - offset - 1) {
        this.scrollPosition.emit('bottom');
      }

      // emit top event
      if (top === 0) {
        this.scrollPosition.emit('top');
      }

    } catch (err) {}
  }

}

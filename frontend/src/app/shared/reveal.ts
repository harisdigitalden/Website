import { Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';

// Fades and slides an element in the first time it scrolls into view.
// Usage: <div appReveal [revealDelay]="200">…</div>
@Directive({
  selector: '[appReveal]',
  host: { class: 'reveal', '[style.transition-delay.ms]': 'revealDelay()' },
})
export class Reveal {
  readonly revealDelay = input(0);

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;
    afterNextRender(() => {
      if (!('IntersectionObserver' in window)) {
        el.classList.add('in');
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              el.classList.add('in');
              observer.disconnect();
            }
          }
        },
        { threshold: 0.15 },
      );
      observer.observe(el);
    });
  }
}

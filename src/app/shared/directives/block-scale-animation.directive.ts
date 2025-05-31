import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector:
    '[appBlockScaleAnimation]',
  standalone: true
})
export class BlockScaleAnimationDirective implements AfterViewInit {
  @Input() duration = 0.8;
  @Input() triggerStart = 'top 80%';
  @Input() triggerEnd = 'top 20%';
  @Input() useScrollTrigger = true;

  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const element = this.el.nativeElement;
    const animationConfig: any = {
      scale: 1,
      opacity: 1,
      duration: this.duration,
      ease: 'power2.out',
    };
    if (this.useScrollTrigger) {
      animationConfig['scrollTrigger'] = {
        trigger: element,
        start: this.triggerStart,
        end: this.triggerEnd,
        toggleActions: 'play none none reverse',
      };
    }
    gsap.fromTo(element, { scale: 0, opacity: 0.5 }, animationConfig);
  }
}

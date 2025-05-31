import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appTypingAnimation]',
  standalone: true
})
export class TypingAnimationDirective implements AfterViewInit {
  @Input() staggerDelay = 0.05;
  @Input() triggerStart = 'top 80%';
  @Input() triggerEnd = 'top 20%';
  @Input() useScrollTrigger = true;

  constructor(private el: ElementRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit() {
    const textElement = this.el.nativeElement;
    const text = textElement.textContent;
    textElement.textContent = '';

    const chars = text.split('').map((char: string | null, index: any) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      textElement.appendChild(span);
      return span;
    });

    const animationConfig:any = {
      opacity: 1,
      duration: 0.1,
      ease: 'none',
      stagger: this.staggerDelay,
    };
    if (this.useScrollTrigger) {
      animationConfig['scrollTrigger'] = {
        trigger: textElement,
        start: this.triggerStart,
        end: this.triggerEnd,
        toggleActions: 'play none none reverse',
      };
    }
    gsap.to(chars, animationConfig);
  }
}

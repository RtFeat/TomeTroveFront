import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appSpinnerRotationAnimation]',
  standalone: true,
})
export class SpinnerRotationAnimationDirective implements AfterViewInit {
  @Input() duration: number = 2; // Duration of rotation (2 seconds)
  @Input() triggerStart: string = 'top 80%'; // Start of animation
  @Input() triggerEnd: string = 'top 20%'; // End of animation

  constructor(private el: ElementRef<HTMLElement>) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;

    // Set initial state without rotation
    gsap.set(element, {
      rotation: 10,
    });

    // Animation triggered on scroll
    gsap.fromTo(
      element,
      { rotation: 10 },
      {
        rotation: 370, // Full rotation (360 degrees)
        duration: this.duration,
        ease: 'power2.inOut', // Smooth acceleration and deceleration
        onComplete: () => {
          // Reset rotation to 0 after animation completes
          gsap.set(element, { rotation: 10 });
        },
        scrollTrigger: {
          trigger: element,
          start: this.triggerStart,
          end: this.triggerEnd,
          toggleActions: 'play none none reverse', // Plays once on entering
        },
      }
    );
  }
}

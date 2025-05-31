import { Directive, ElementRef, AfterViewInit, Input, numberAttribute } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appSlideAnimation]',
  standalone: true,
})
export class SlideAnimationDirective implements AfterViewInit {
  @Input() direction: 'left' | 'right' = 'left'; // Направление анимации
  @Input() distance = 250; // Расстояние смещения
  @Input() duration = 1.5; // Длительность анимации
  @Input({ transform: numberAttribute }) delay = 0.2; // Задержка
  @Input() triggerStart = 'top 80%'; // Начало анимации
  @Input() triggerEnd = 'top 20%'; // Конец анимации

  constructor(private el: ElementRef<HTMLElement>) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    const initialX = this.direction === 'left' ? -this.distance : this.distance;

    // Устанавливаем начальное состояние без анимации
    gsap.set(element, {
      x: initialX,
      opacity: 0,
    });

    // Анимация запускается только при прокрутке
    gsap.fromTo(
      element,
      { x: initialX, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: this.duration,
        ease: 'power2.out',
        delay: this.delay,
        scrollTrigger: {
          trigger: element,
          start: this.triggerStart,
          end: this.triggerEnd,
          toggleActions: 'play none none reverse', // Играет при входе, возвращается при выходе
        },
      }
    );
  }
}

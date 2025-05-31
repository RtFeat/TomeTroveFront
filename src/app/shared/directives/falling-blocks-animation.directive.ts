import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Directive({
  selector: '[appFallingBlocksAnimation]',
  standalone: true,
})
export class FallingBlocksAnimationDirective implements AfterViewInit {
  @Input() fallDistance: number = 100; // Дистанция падения
  @Input() rotationRange: number = 10; // Диапазон вращения
  @Input() duration: number = 1.5; // Длительность анимации
  @Input() delay: number = 0; // Задержка для последовательности
  @Input() bounceHeight: number = 20; // Высота отскока
  @Input() triggerStart: string = 'top 80%'; // Начало анимации
  @Input() triggerEnd: string = 'top 20%'; // Конец анимации
  @Input() index: number = 0; // Индекс блока для координации

  constructor(private el: ElementRef<HTMLElement>) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;

    // Начальное состояние: блок "в воздухе"
    gsap.set(element, {
      y: -this.fallDistance,
      opacity: 0,
      rotation: -this.rotationRange * (Math.random() > 0.5 ? 1 : -1),
    });

    // Анимация падения с физическим эффектом
    gsap.to(element, {
      y: this.bounceHeight, // Падение до уровня отскока
      opacity: 1,
      rotation: this.rotationRange * (Math.random() > 0.5 ? 1 : -1), // Случайное вращение
      duration: this.duration,
      delay: this.delay,
      ease: 'power2.out', // Гравитация
      physics2D: {
        velocity: 200, // Начальная скорость падения
        angle: 0, // Направление (вертикально вниз)
        gravity: 800, // Ускорение гравитации
      },
      onComplete: () => {
        // Отскок и "лежание"
        gsap.fromTo(
          element,
          { y: this.bounceHeight, rotation: this.rotationRange * (Math.random() > 0.5 ? 1 : -1) },
          {
            y: 0,
            rotation: this.rotationRange * 0.5 * (Math.random() > 0.5 ? 1 : -1),
            x: (Math.random() - 0.5) * 20, // Случайное смещение для имитации столкновения
            duration: 0.5,
            ease: 'bounce.out', // Эффект отскока
          }
        );
      },
      scrollTrigger: {
        trigger: element,
        start: this.triggerStart,
        end: this.triggerEnd,
        toggleActions: 'play none none reverse',
      },
    });
  }
}

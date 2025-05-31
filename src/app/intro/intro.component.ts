import {AfterViewInit, Component, ElementRef, Inject, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AuthModalService} from '../auth/shared/service/auth-modal.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {TypingAnimationDirective} from '../shared/directives/typing-animation.directive';
import {BlockScaleAnimationDirective} from '../shared/directives/block-scale-animation.directive';
import {SlideAnimationDirective} from '../shared/directives/slide-animation.directive';
import {PixelateOnHoverDirective} from '../shared/directives/pixelate-hover.directive';
import {FallingBlocksAnimationDirective} from '../shared/directives/falling-blocks-animation.directive';
import {SpinnerRotationAnimationDirective} from '../shared/directives/spinner-rotation-animation.directive';
import {RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {APP_CONFIG, AppConfig} from '../app.config';

gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-intro',
  imports: [
    TypingAnimationDirective,
    BlockScaleAnimationDirective,
    SlideAnimationDirective,
    PixelateOnHoverDirective,
    FallingBlocksAnimationDirective,
    SpinnerRotationAnimationDirective,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './intro.component.html',
  standalone: true,
  styleUrl: './intro.component.scss'
})
export class IntroComponent implements AfterViewInit {
  private staticUrl: string;
  formData = {
    name: '',
    phone: '',
    email: '',
    question: ''
  };

  @ViewChild('about_leftBlock') about_leftBlock!: ElementRef;
  @ViewChild('about_rightBlock') about_rightBlock!: ElementRef;
  @ViewChild('square1') square1!: ElementRef;
  @ViewChild('square2') square2!: ElementRef;
  @ViewChild('square3') square3!: ElementRef;
  @ViewChild('square4') square4!: ElementRef;
  @ViewChildren(FallingBlocksAnimationDirective) blocks!: QueryList<FallingBlocksAnimationDirective>;

  constructor(
    public authModal: AuthModalService,
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.staticUrl = config.staticUrl;
  }

  ngAfterViewInit() {
    this.blocks.forEach((block, index) => {
      block.delay = index * 0.1; // Задержка увеличивается для каждого блока
      block.index = index; // Устанавливаем индекс для координации
    });

    gsap.fromTo(
      this.about_leftBlock.nativeElement,
      { x: -100, opacity: 0 }, // Начальное состояние
      {
        x: 0, // Конечное состояние
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.about_leftBlock.nativeElement, // Триггер — сам элемент
          start: 'top 80%', // Начать, когда верх элемента достигает 80% высоты окна
          end: 'top 20%', // Закончить, когда верх элемента достигает 20% высоты окна
          scrub: 1, // Плавная анимация при прокрутке
          toggleActions: 'play none none reverse', // Поведение при прокрутке
        },
      }
    );

    // Анимация для правого блока
    gsap.fromTo(
      this.about_rightBlock.nativeElement,
      { x: 100, opacity: 0 }, // Начальное состояние
      {
        x: 0, // Конечное состояние
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.about_rightBlock.nativeElement,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
          toggleActions: 'play none none reverse',
        },
      }
    );

    const squares = [
      this.square1.nativeElement,
      this.square2.nativeElement,
      this.square3.nativeElement,
      this.square4.nativeElement,
    ];

    squares.forEach((square, index) => {
      gsap.fromTo(
        square,
        { scale: 0, opacity: 0.5 }, // Начальное состояние
        {
          scale: 1, // Конечное состояние
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          delay: index * 0.2, // Задержка для последовательной анимации
          scrollTrigger: {
            trigger: square, // Триггер — каждый квадрат
            start: 'top 80%', // Начать, когда верх квадрата достигает 80% высоты окна
            end: 'top 20%', // Закончить, когда верх квадрата достигает 20% высоты
            toggleActions: 'play none none reverse', // Анимация проигрывается один раз
          },
        }
      );
    });
  }
  onSubmit() {
    this.http.post(`${this.staticUrl}/questions/`, this.formData)
      .subscribe({
        next: (response) => {
          alert('Вопрос отправлен!');
          this.formData = { name: '', phone: '', email: '', question: '' };
        },
        error: (error) => {
          alert('Ошибка при отправке вопроса.');
          console.error(error);
        }
      });
  }
  model = {
    name: '',
    phone: '',
    email: ''
  };

  btnSubmit() {
    if (this.model.name && this.model.phone && this.model.email) {
      console.log('Форма отправлена:', this.model);
      alert('Благодарим за обратную связь')
      this.model = { name: '', phone: '', email: '' };
    } else {
      alert('Проверьте введенные данные')
    }
  }
}

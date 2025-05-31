import { Directive, ElementRef, Input, OnInit, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';

@Directive({
  selector: '[appPixelateOnHover]',
  standalone: true,
})
export class PixelateOnHoverDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() pixelSize: number = 10; // Уменьшен для оптимизации
  @Input() effectRadius: number = 30; // Уменьшен для оптимизации

  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private img: HTMLImageElement | null = null;
  private isHovering: boolean = false;
  private lastMouseMove: number = 0;
  private throttleDelay: number = 10; // Ограничение: 20 раз в секунду
  private animationTimeline: gsap.core.Timeline | null = null;

  constructor(private el: ElementRef<HTMLImageElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.img = this.el.nativeElement;
    if (!this.img) {
      console.error('Image element is not available');
      return;
    }
  }

  ngAfterViewInit(): void {
    if (this.img?.complete) {
      this.setupCanvas();
    } else {
      this.img!.onload = () => this.setupCanvas();
      this.img!.onerror = () => console.error('Failed to load image');
    }
  }

  ngOnDestroy(): void {
    // Очищаем анимацию и слушатели
    if (this.animationTimeline) {
      this.animationTimeline.kill();
    }
  }

  private setupCanvas(): void {
    if (!this.img) {
      console.error('Image element is not available');
      return;
    }

    this.canvas = this.renderer.createElement('canvas');
    if (!this.canvas) {
      console.error('Failed to create canvas');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    const width = this.img.naturalWidth || this.img.width;
    const height = this.img.naturalHeight || this.img.height;

    if (width === 0 || height === 0) {
      console.warn('Image dimensions are not available, retrying...');
      setTimeout(() => this.setupCanvas(), 100);
      return;
    }


    this.canvas.width = width;
    this.canvas.height = height;

    this.renderer.setAttribute(this.canvas, 'class', this.img.getAttribute('class') || '');
    this.renderer.setStyle(this.canvas, 'width', this.img.style.width || `${width}px`);
    this.renderer.setStyle(this.canvas, 'height', this.img.style.height || `${height}px`);
    this.renderer.setStyle(this.canvas, 'pointer-events', 'auto');

    if (this.img.parentNode) {
      this.renderer.insertBefore(this.img.parentNode, this.canvas, this.img);
      this.renderer.removeChild(this.img.parentNode, this.img);
    }

    this.bindMouseEvents();
    this.drawImage();
  }

  private bindMouseEvents(): void {
    if (!this.canvas) {
      console.error('Cannot bind mouse events: canvas is null');
      return;
    }

    this.renderer.listen(this.canvas, 'mouseenter', () => {
      this.isHovering = true;
      this.startPixelationAnimation();
    });

    this.renderer.listen(this.canvas, 'mouseleave', () => {
      this.isHovering = false;
      if (this.animationTimeline) {
        this.animationTimeline.kill();
        this.animationTimeline = null;
      }
      this.drawImage();
    });

    this.renderer.listen(this.canvas, 'mousemove', (event: MouseEvent) => {
      const now = performance.now();
      if (now - this.lastMouseMove < this.throttleDelay) {
        return; // Троттлинг
      }
      this.lastMouseMove = now;

      if (!this.isHovering || !this.canvas || !this.ctx || !this.img) {
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const mouseX = (event.clientX - rect.left) * scaleX;
      const mouseY = (event.clientY - rect.top) * scaleY;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawImage();
      this.applyPixelation(mouseX, mouseY);
    });
  }

  private drawImage(): void {
    if (!this.ctx || !this.img || !this.canvas) {
      return;
    }
    this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
  }

  private startPixelationAnimation(): void {
    if (this.animationTimeline) {
      this.animationTimeline.kill(); // Останавливаем предыдущую анимацию
    }

    this.animationTimeline = gsap.timeline();
    this.animationTimeline.to({ pixelSize: this.pixelSize }, {
      pixelSize: this.pixelSize * 1.5,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      onUpdate: () => {
        this.pixelSize = gsap.getProperty(this, 'pixelSize') as number;
      },
    });
  }

  private applyPixelation(mouseX: number, mouseY: number): void {
    if (!this.ctx || !this.canvas) {
      return;
    }

    const radius = this.effectRadius;
    const pixelSize = Math.round(this.pixelSize); // Округляем для стабильности

    const startX = Math.max(0, mouseX - radius);
    const startY = Math.max(0, mouseY - radius);
    const width = Math.min(radius * 2, this.canvas.width - startX);
    const height = Math.min(radius * 2, this.canvas.height - startY);

    if (width <= 0 || height <= 0) {
      return;
    }

    const imageData = this.ctx.getImageData(startX, startY, width, height);
    const pixels = imageData.data;

    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const centerX = x + pixelSize / 2;
        const centerY = y + pixelSize / 2;
        const distance = Math.sqrt(
          Math.pow(centerX - (mouseX - startX), 2) + Math.pow(centerY - (mouseY - startY), 2)
        );

        if (distance <= radius) {
          const pixelIndex = (y * width + x) * 4;
          const r = pixels[pixelIndex];
          const g = pixels[pixelIndex + 1];
          const b = pixels[pixelIndex + 2];
          const a = pixels[pixelIndex + 3];

          for (let py = y; py < Math.min(y + pixelSize, height); py++) {
            for (let px = x; px < Math.min(x + pixelSize, width); px++) {
              const index = (py * width + px) * 4;
              pixels[index] = r;
              pixels[index + 1] = g;
              pixels[index + 2] = b;
              pixels[index + 3] = a;
            }
          }
        }
      }
    }

    this.ctx.putImageData(imageData, startX, startY);
  }
}

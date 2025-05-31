import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AuthService, User} from '../../auth/shared/service/auth.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HeaderComponent} from '../header/header.component';
import {SlideAnimationDirective} from '../../shared/directives/slide-animation.directive';
import {BlockScaleAnimationDirective} from '../../shared/directives/block-scale-animation.directive';
import {CommonModule} from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    HeaderComponent,
    SlideAnimationDirective,
    BlockScaleAnimationDirective,
    CommonModule
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  user: User | null = null;
  error: string | null = null;

  isModalOpen = false;
  currentVideoSource = '';

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private renderer: Renderer2
    ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });

    if (this.authService.isAuthenticated()) {
      this.authService.getUserProfile().subscribe({
        next: (userData: User) => {
          this.user = userData;
          console.log('User data:', this.user); // Для отладки
        },
        error: (err) => {
          this.error = 'Failed to load user profile';
          console.error('Error fetching user profile:', err);
        }
      });
    }
  }

  openModal(source: string) {
    this.currentVideoSource = source;
    this.isModalOpen = true;
    this.renderer.addClass(document.body, 'no-scroll');
    setTimeout(() => {
      const modal = document.querySelector('.modal');
      if (modal) {
        this.renderer.addClass(modal, 'show');
      }
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
  }

  closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      this.renderer.removeClass(modal, 'show');
    }
    this.isModalOpen = false;
    this.renderer.removeClass(document.body, 'no-scroll');
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.pause();
      this.videoPlayer.nativeElement.currentTime = 0;
    }
  }

}

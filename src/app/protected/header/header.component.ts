import {Component, Inject, OnInit} from '@angular/core';
import {AuthService, User} from '../../auth/shared/service/auth.service';
import {RouterLink} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {ProfileComponent} from '../account/profile/profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {APP_CONFIG, AppConfig} from '../../app.config';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatMenuModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  private mediaUrl: string;
  private staticUrl: string;

  user: User | null = null;
  error: string | null = null;
  avatarPreview: string | null = null;
  defaultAvatarUrl: string;

  constructor(
    protected authService: AuthService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.defaultAvatarUrl = `${config.mediaUrl}avatars/profile.svg`;
    this.mediaUrl = config.mediaUrl;
    this.staticUrl = config.staticUrl;
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.getUserProfile().subscribe({
        next: (userData: User) => {
          this.user = userData;
          this.avatarPreview = this.user.avatar ? `${this.staticUrl}${this.user.avatar}` : null;
        },

        error: (err) => {
          this.error = 'Failed to load user profile';
          console.error('Error fetching user profile:', err);
        }
      });
    }
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {HeaderComponent} from '../../header/header.component';
import {Router, RouterLink} from '@angular/router';
import {AuthService, User} from '../../../auth/shared/service/auth.service';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Subscription} from 'rxjs';
import {APP_CONFIG, AppConfig} from '../../../app.config';

@Component({
  selector: 'app-profile',
  imports: [
    HeaderComponent,
    RouterLink,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  standalone: true,
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private mediaUrl: string;
  private staticUrl: string;

  form: FormGroup;
  nameForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  avatarPreview: string | null = null;
  defaultAvatarUrl: string;
  private userSubscription: Subscription | undefined;

  constructor(
    protected authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.defaultAvatarUrl = `${config.mediaUrl}avatars/profile.svg`;

    this.nameForm = this.fb.group({
      login: ['', [Validators.required]]
    });
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.form = new FormGroup({
      avatar: new FormControl(null),
    });

    this.mediaUrl = config.mediaUrl;
    this.staticUrl = config.staticUrl;
  }

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      if (user) {
        // Устанавливаем текущие значения в формы
        this.nameForm.patchValue({
          login: user.login
        });
        this.emailForm.patchValue({
          email: user.email
        });
        // Поле пароля оставляем пустым для безопасности
      }
    });

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.form.patchValue({
          login: user.login,
          email: user.email,
          password: user.password,
        });
        this.avatarPreview = user.avatar ? `${this.staticUrl}${user.avatar}` : null;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile';
        console.error(error);
      },
    });
  }

  //AVATAR CHANGE

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Показываем превью
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      // Отправляем файл сразу
      const userData = {
        avatar: file,
      };
      this.authService.updateUserProfile(userData).subscribe({
        next: (user) => {
          this.successMessage = 'Avatar updated successfully';
          this.errorMessage = '';
          this.avatarPreview = user.avatar ? `${this.staticUrl}${user.avatar}` : null;
        },
        error: (error) => {
          this.errorMessage = 'Failed to update avatar';
          this.successMessage = '';
          console.error(error);
        },
      });
    }
  }

  deleteAvatar() {
    this.authService.deleteAvatar().subscribe({
      next: () => {
        this.successMessage = 'Avatar deleted successfully';
        this.errorMessage = '';
        this.avatarPreview = `${this.mediaUrl}avatars/profile.svg`;
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete avatar';
        this.successMessage = '';
        console.error(error);
      },
    });
  }

  //START CHANGE USER_PROFILE

  changeName() {
    if (this.nameForm.invalid) {
      return;
    }
    const userData = {
      login: this.nameForm.value.login,
    };
    this.authService.updateUserProfile(userData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile';
        this.successMessage = '';
        console.error(error);
      },
    });
  }

  changeEmail() {
    if (this.emailForm.invalid) {
      return;
    }
    const userData = {
      email: this.emailForm.value.email,
    };
    this.authService.updateUserProfile(userData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile';
        this.successMessage = '';
        console.error(error);
      },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      return;
    }
    const userData = {
      password: this.passwordForm.value.password,
    };
    this.authService.updateUserProfile(userData).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully';
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile';
        this.successMessage = '';
        console.error(error);
      },
    });
  }

  //END CHANGE USER_PROFILE

  logout() {
    this.authService.logout();
  }
}

import {Inject, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {APP_CONFIG, AppConfig} from '../../../app.config';

interface LoginResponse {
  message: string;
  user_id: string;
  token: string;
}

export interface User {
  id: number;
  login: string;
  email: string;
  password: string;
  avatar?: string;
  is_superuser: boolean; // Добавляем поле для проверки администратора
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private userId: number | null = null;
  private token: string | null = null;
  private userSubject = new BehaviorSubject<User | null>(null); // Храним данные пользователя
  user$ = this.userSubject.asObservable(); // Подписка на данные пользователя

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.apiUrl = config.apiUrl;
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');
    if (storedUserId && storedToken) {
      this.userId = +storedUserId;
      this.token = storedToken;
      this.isLoggedInSubject.next(true);
      // Загружаем профиль пользователя при инициализации
      this.loadUserProfile();
    }
  }

  // Загрузка профиля пользователя
  private loadUserProfile(): void {
    if (this.token) {
      this.getUserProfile().subscribe({
        next: (user) => {
          this.userSubject.next(user);
        },
        error: (err) => {
          console.error('Error loading user profile:', err);
          this.logout(); // Если профиль не загружается, разлогиниваем
        }
      });
    }
  }

  login(credentials: { login: string, password: string }): Observable<LoginResponse> {
    const payload = {
      login: credentials.login,
      password: credentials.password,
    };
    console.log('Sending login payload:', payload);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, payload).pipe(
      tap(response => {
        if (!response.user_id || !response.token) {
          throw new Error('Invalid login response: user_id or token missing');
        }
        console.log('Login response:', response);
        this.userId = +response.user_id;
        this.token = response.token;
        this.isLoggedInSubject.next(true);
        localStorage.setItem('userId', response.user_id.toString());
        localStorage.setItem('token', response.token);
        // Загружаем профиль после успешного логина
        this.loadUserProfile();
      })
    );
  }

  register(user: { login: string, email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, user);
  }

  logout(): void {
    this.userId = null;
    this.token = null;
    this.isLoggedInSubject.next(false);
    this.userSubject.next(null); // Очищаем данные пользователя
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    this.router.navigate(['/intro']);
  }

  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }

  isAdmin(): boolean {
    const user = this.userSubject.value;
    return user ? user.is_superuser : false;
  }

  getUserId(): number | null {
    return this.userId;
  }

  getToken(): string | null {
    return this.token;
  }

  getUserProfile(): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });
    return this.http.get<User>(`${this.apiUrl}/profile/`, { headers });
  }

  updateUserProfile(user: { login?: string; email?: string; password?: string; avatar?: File }): Observable<User> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });
    const formData = new FormData();
    if (user.login) formData.append('login', user.login);
    if (user.email) formData.append('email', user.email);
    if (user.password) formData.append('password', user.password);
    if (user.avatar) formData.append('avatar', user.avatar);
    return this.http.put<User>(`${this.apiUrl}/profile/`, formData, { headers }).pipe(
      tap(updatedUser => this.userSubject.next(updatedUser)) // Обновляем данные пользователя
    );
  }

  deleteAvatar(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.token}`,
    });
    return this.http.delete(`${this.apiUrl}/profile/`, { headers });
  }
}

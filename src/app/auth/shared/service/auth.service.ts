import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';

interface LoginResponse {
  message: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Подписка на состояние
  private  userId: number | null = null; // Хранит ID пользователя

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.userId = +storedUserId;
      this.isLoggedInSubject.next(true);
    }
  }

  login(credentials: { login: string, password: string } ):Observable<LoginResponse> {
    const payload = {
      login: credentials.login,
      password: credentials.password,
    };
    console.log('Sending login payload:', payload);
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, payload).pipe(
      tap(response => {
        if(!response.user_id) {
          throw new Error('Invalid login response: user_id missing');
        }
        console.log('Login response:', response); // Откладка
        //Сохраняем данные после успешного логина
        this.userId = +response.user_id;
        this.isLoggedInSubject.next(true);
        localStorage.setItem('userId', response.user_id.
        toString()); //Сохраняем user_id
      })
    );
  }

  register(user: { login: string, email:string, password: string } ):Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, user);
  }

  logout(): void {
    this.userId = null;
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('userId');
    this.router.navigate(['/intro'])
  }

  isAuthenticated():boolean {
    return this.isLoggedInSubject.value;
  }

  getUserId():number | null {
    return this.userId;
  }
}


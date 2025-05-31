import {Inject, Injectable} from '@angular/core';
import {Anthology, Transaction} from '../interfaces';
import {map, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {APP_CONFIG, AppConfig} from '../../../app.config';

@Injectable({
  providedIn: 'root'
})
export class AnthologyService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.apiUrl = config.apiUrl;
  }

  createPayment(anthologyId: number): Observable<{ payment_url: string; transaction_id: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });
    return this.http.post<{ payment_url: string; transaction_id: number }>(
      `${this.apiUrl}/payment/create/`,
      { anthology_id: anthologyId },
      { headers }
    );
  }

  getTransactions(): Observable<Transaction[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions/`, { headers });
  }

  createAnthology(formData: FormData): Observable<Anthology> {
    return this.http.post<Anthology>(`${this.apiUrl}/anthology/create/`, formData);
  }

  getAnthologies(): Observable<Anthology[]> {
    return this.http.get<Anthology[]>(`${this.apiUrl}/anthology/list/`);
  }

  getById(id: string): Observable<Anthology> {
    return this.http.get<Anthology>(`${this.apiUrl}/anthology/${id}/`);
  }
}

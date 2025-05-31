import {Component, Inject, OnInit} from '@angular/core';
import {AnthologyService} from '../../protected/shared/service/anthology.service';
import {Anthology} from '../../protected/shared/interfaces';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from '../../protected/header/header.component';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../auth/shared/service/auth.service';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {APP_CONFIG, AppConfig} from '../../app.config';

@Component({
  selector: 'app-admin-panel',
  imports: [FormsModule, HeaderComponent, RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './admin-panel.component.html',
  standalone: true,
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent implements OnInit{
  private apiUrl: string;
  questions: any[] = [];
  anthology: Anthology = {
    title: '',
    image: '',
    description: '',
    topic: '',
    price: 0
  };
  selectedFile: File | null = null;

  constructor(
    private http: HttpClient,
    private anthologyService: AnthologyService,
    public authService: AuthService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    this.apiUrl = config.apiUrl;
  }

  ngOnInit() {
    this.loadQuestions();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.anthology.title);
    formData.append('description', this.anthology.description);
    formData.append('topic', this.anthology.topic);
    formData.append('price', this.anthology.price.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.anthologyService.createAnthology(formData).subscribe({
      next: (response) => {
        console.log('Anthology created:', response);
        // Очистка формы или редирект
        this.anthology = { title: '', image: '', description: '', topic: '', price: 0 };
        this.selectedFile = null;
      },
      error: (error) => console.error('Error creating anthology:', error)
    });
  }

  loadQuestions(): void {
    this.http.get<any[]>(`${this.apiUrl}/questions/`)
      .subscribe({
        next: (data) => {
          this.questions = data;
        },
        error: (error) => {
          console.error('Ошибка при загрузке вопросов:', error);
        }
      });
  }
}

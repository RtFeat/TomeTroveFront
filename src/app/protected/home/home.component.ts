import {Component} from '@angular/core';
import {AuthModalService} from '../../auth/shared/service/auth-modal.service';
import {AuthService} from '../../auth/shared/service/auth.service';
import {RouterLink} from '@angular/router';
import {MarqueeComponent} from '../../shared/marquee/marquee.component';
import {HeaderComponent} from '../header/header.component';


@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MarqueeComponent,
    HeaderComponent
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  marqueeItems = [
    'Новая подборка: Тренды 2025',
    'Популярные подборки: Технологии',
    'Сейчас на сайте: 1200 пользователей'
  ];

  constructor( public authService: AuthService, ) {
  }

}

import { Component } from '@angular/core';
import {AuthService} from '../../auth/shared/service/auth.service';
import {RouterLink} from '@angular/router';
import {MatMenuModule} from '@angular/material/menu';
import {MatButton, MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  xPos: 'before' | 'after' = 'before'; // или 'after'
  yPos: 'above' | 'below' = 'below';
  constructor(
    protected authService: AuthService,
  ) {}
}

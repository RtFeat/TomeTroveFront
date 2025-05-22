import { Component } from '@angular/core';
import {AuthModalService} from '../auth/shared/service/auth-modal.service';

@Component({
  selector: 'app-intro',
  imports: [],
  templateUrl: './intro.component.html',
  standalone: true,
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
  constructor(
    public authModal: AuthModalService,
  ) {}

}

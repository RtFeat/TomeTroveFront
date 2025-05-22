import {Component} from '@angular/core';
import {AuthService} from '../../auth/shared/service/auth.service';
import {AppComponent} from '../../app.component';
import {HeaderComponent} from '../header/header.component';

@Component({
  selector: 'app-anthology',
  imports: [AppComponent, HeaderComponent],
  templateUrl: './anthology.component.html',
  standalone: true,
  styleUrl: './anthology.component.scss'
})
export class AnthologyComponent {

}

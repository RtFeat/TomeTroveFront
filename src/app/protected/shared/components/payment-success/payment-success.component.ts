import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-payment-success',
  imports: [
    RouterLink,
    MatButton
  ],
  templateUrl: './payment-success.component.html',
  standalone: true,
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {

}

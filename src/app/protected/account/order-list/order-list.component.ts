import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../header/header.component';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../auth/shared/service/auth.service';
import {AnthologyService} from '../../shared/service/anthology.service';
import {Observable} from 'rxjs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Transaction} from '../../shared/interfaces';

@Component({
  selector: 'app-order-list',
  imports: [
    HeaderComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './order-list.component.html',
  standalone: true,
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit{
  constructor(
    public authService: AuthService,
    private anthologyService: AnthologyService,
  ){}

  transactions$!: Observable<Transaction[]>;

  ngOnInit(): void {
    this.transactions$ = this.anthologyService.getTransactions();
  }

}

import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HomeComponent} from './protected/home/home.component';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {AsyncPipe, CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, MatSlideToggle, AsyncPipe, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
  }

}

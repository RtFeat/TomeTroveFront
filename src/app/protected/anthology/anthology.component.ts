import {Component, Input, OnInit} from '@angular/core';
import {HeaderComponent} from '../header/header.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchPipe} from '../shared/service/search.pipe';
import {Anthology} from '../shared/interfaces';
import {AnthologyService} from '../shared/service/anthology.service';
import {SearchPricePipe} from '../shared/service/searchPrice.pipe';
import {CollectionsComponent} from '../shared/components/collections/collections.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-anthology',
  imports: [HeaderComponent, CommonModule, FormsModule, ReactiveFormsModule, SearchPipe, SearchPricePipe],
  templateUrl: './anthology.component.html',
  standalone: true,
  styleUrl: './anthology.component.scss'
})
export class AnthologyComponent implements OnInit {
  @Input() book: Anthology | undefined;

  anthologies: Anthology[] = [];
  searchStr: '' | undefined;
  minPrice: number = 0;
  maxPrice: number = 2000;

  constructor(
    private anthologyService: AnthologyService,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {
    this.anthologyService.getAnthologies().subscribe({
      next: (data) => this.anthologies = data,
      error: (error) => console.error('Error fetching anthologies:', error)
    });
  }

  openModal(id?: number): void {
    if (!id) {
      console.error('ID is undefined');
      return;
    }

    this.anthologyService.getById(id.toString()).subscribe({
      next: (anthology) => {
        this.dialog.open(CollectionsComponent, {
          width: '500px',
          data: anthology, // Передаём данные антологии в модальное окно
        });
      },
      error: (error) => {
        console.error('Error fetching anthology:', error);
        // Можно показать уведомление об ошибке
      },
    });
  }

  // isolation Window
  // openCollection(id?: number): void {
  //   if (id) {
  //     // Открытие в новой вкладке
  //     window.open(`/protected/collections/${id}`, '_blank');
  //   } else {
  //     console.error('ID is undefined');
  //   }
  // }
}

import {Pipe, PipeTransform} from '@angular/core';
import {Anthology} from '../../shared/interfaces';

@Pipe({standalone: true, name: 'searchAnthologies'})

export class SearchPipe implements PipeTransform {
  transform(books: Anthology[], search = ''): Anthology[] {
    if (!search.trim()) {
      return books;
    }
    return books.filter(book => {
      return book.title.toLowerCase().includes(search.toLowerCase());
    })
  }
}

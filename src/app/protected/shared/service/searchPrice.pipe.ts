import { Pipe, PipeTransform } from '@angular/core';
import { Anthology } from '../../shared/interfaces';

@Pipe({ standalone: true, name: 'searchPrice' })
export class SearchPricePipe implements PipeTransform {
  transform(books: Anthology[], minPrice: any = null, maxPrice: any = null): Anthology[] {
    if (!books) {
      return [];
    }

    // Если оба поля пусты (null, undefined или пустая строка), возвращаем все книги
    if ((minPrice === null || minPrice === '' || isNaN(Number(minPrice))) &&
      (maxPrice === null || maxPrice === '' || isNaN(Number(maxPrice)))) {
      return books;
    }

    const min = isNaN(Number(minPrice)) || minPrice === '' || minPrice === null ? 0 : Number(minPrice);
    const max = isNaN(Number(maxPrice)) || maxPrice === '' || maxPrice === null ? Infinity : Number(maxPrice);

    return books.filter(book => {
      const price = book.price || 0;
      return price >= min && price <= max;
    });
  }
}

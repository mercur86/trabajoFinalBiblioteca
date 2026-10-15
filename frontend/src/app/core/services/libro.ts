import { Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Libro } from '../models/libro';
import { GenericService } from './generic';

@Service()
export class LibroService extends GenericService<Libro> {

  protected override url: string = `${environment.HOST}/v1/libros`;

  //buscador combinado por titulo, autor o isbn
  search(term: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.url}/search`, { params: { term } });
  }
}

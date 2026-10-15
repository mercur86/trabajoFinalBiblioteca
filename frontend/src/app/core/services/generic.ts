import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

// Base para los servicios CRUD. autoProvided: false evita registrarse por si sola;
// cada servicio concreto (@Service()) fija su url.
@Service({ autoProvided: false })
export abstract class GenericService<T> {

  protected readonly http = inject(HttpClient);

  protected abstract url: string;

  findAll(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  findById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  save(t: T): Observable<unknown> {
    return this.http.post(this.url, t);
  }

  update(id: number, t: T): Observable<unknown> {
    return this.http.put(`${this.url}/${id}`, t);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

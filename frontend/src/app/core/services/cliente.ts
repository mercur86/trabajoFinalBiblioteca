import { Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente } from '../models/cliente';
import { GenericService } from './generic';

@Service()
export class ClienteService extends GenericService<Cliente> {

  protected override url: string = `${environment.HOST}/v1/clientes`;

  //buscador por nombres, apellidos, cedula o email
  search(term: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.url}/search`, { params: { term } });
  }
}

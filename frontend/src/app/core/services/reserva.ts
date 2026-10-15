import { Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Reserva } from '../models/reserva';
import { GenericService } from './generic';

@Service()
export class ReservaService extends GenericService<Reserva> {

  protected override url: string = `${environment.HOST}/v1/reservas`;

  findByCliente(idCliente: number): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.url}/cliente/${idCliente}`);
  }
}

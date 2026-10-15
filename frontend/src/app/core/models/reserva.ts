import { Cliente } from './cliente';
import { DetalleReserva } from './detalle-reserva';

export interface Reserva {
  idReserva?: number;
  fechaReserva: string;
  cliente: Cliente;
  detalles: DetalleReserva[];
}

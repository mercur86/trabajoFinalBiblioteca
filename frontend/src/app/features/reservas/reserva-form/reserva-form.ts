import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Cliente } from '../../../core/models/cliente';
import { Libro } from '../../../core/models/libro';
import { Reserva } from '../../../core/models/reserva';
import { ReservaService } from '../../../core/services/reserva';
import { NotificationService } from '../../../core/ui/notification';
import { ClientePicker } from '../../../shared/pickers/cliente-picker/cliente-picker';
import { LibroPicker } from '../../../shared/pickers/libro-picker/libro-picker';

@Component({
  selector: 'app-reserva-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    ClientePicker,
    LibroPicker,
  ],
  templateUrl: './reserva-form.html',
  styleUrl: './reserva-form.scss',
})
export class ReservaForm {

  private readonly service = inject(ReservaService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  protected readonly cliente = signal<Cliente | null>(null);
  protected readonly libros = signal<Libro[]>([]);
  protected readonly saving = signal(false);

  protected readonly form = new FormGroup({
    fecha: new FormControl<Date | null>(null, Validators.required),
    hora: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  constructor() {
    const now = new Date();
    this.form.controls.hora.setValue(this.pad(now.getHours()) + ':' + this.pad(now.getMinutes()));
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const cliente = this.cliente();
    if (!cliente) {
      this.notifications.error('Selecciona un cliente.');
      return;
    }
    if (this.libros().length === 0) {
      this.notifications.error('Selecciona al menos un libro para la reserva.');
      return;
    }

    const { fecha, hora } = this.form.getRawValue();
    //LocalDateTime sin zona: yyyy-MM-ddTHH:mm:00
    const fechaReserva = `${fecha!.getFullYear()}-${this.pad(fecha!.getMonth() + 1)}-${this.pad(fecha!.getDate())}T${hora}:00`;

    this.saving.set(true);
    const payload: Reserva = {
      fechaReserva,
      cliente: { idCliente: cliente.idCliente } as Cliente,
      detalles: this.libros().map((l) => ({ libro: { idLibro: l.idLibro } as Libro })),
    };

    this.service.save(payload).subscribe({
      next: () => {
        this.notifications.success('Reserva registrada');
        this.router.navigate(['/reservas']);
      },
      error: () => this.saving.set(false),
    });
  }
}

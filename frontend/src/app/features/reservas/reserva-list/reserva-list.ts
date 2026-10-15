import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Cliente } from '../../../core/models/cliente';
import { Reserva } from '../../../core/models/reserva';
import { ReservaService } from '../../../core/services/reserva';
import { ClientePicker } from '../../../shared/pickers/cliente-picker/cliente-picker';

@Component({
  selector: 'app-reserva-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    ClientePicker,
  ],
  templateUrl: './reserva-list.html',
  styleUrl: './reserva-list.scss',
})
export class ReservaList {

  private readonly service = inject(ReservaService);

  protected readonly reservas = signal<Reserva[]>([]);
  protected readonly loading = signal(true);
  protected readonly filtroCliente = signal<Cliente | null>(null);
  protected readonly displayedColumns = ['idReserva', 'fechaReserva', 'cliente', 'libros'];
  protected readonly dataSource = new MatTableDataSource<Reserva>();

  private readonly sort = viewChild(MatSort);
  private readonly paginator = viewChild(MatPaginator);

  constructor() {
    effect(() => {
      this.dataSource.data = this.reservas();
      this.dataSource.sort = this.sort() ?? null;
      this.dataSource.paginator = this.paginator() ?? null;
    });
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    const id = this.filtroCliente()?.idCliente;
    const request$ = id ? this.service.findByCliente(id) : this.service.findAll();

    request$.subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected cambiarFiltro(cliente: Cliente | null): void {
    this.filtroCliente.set(cliente);
    this.load();
  }

  protected formatFecha(iso: string): string {
    return new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
  }
}

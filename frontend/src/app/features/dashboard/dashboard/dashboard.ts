import { Component, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CategoriaService } from '../../../core/services/categoria';
import { ClienteService } from '../../../core/services/cliente';
import { LibroService } from '../../../core/services/libro';
import { ReservaService } from '../../../core/services/reserva';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  private readonly libros = inject(LibroService);
  private readonly clientes = inject(ClienteService);
  private readonly categorias = inject(CategoriaService);
  private readonly reservas = inject(ReservaService);

  protected readonly loading = signal(true);
  protected readonly stats = signal({ libros: 0, clientes: 0, categorias: 0, reservas: 0 });

  constructor() {
    forkJoin({
      libros: this.libros.findAll(),
      clientes: this.clientes.findAll(),
      categorias: this.categorias.findAll(),
      reservas: this.reservas.findAll(),
    }).subscribe({
      next: (r) => {
        this.stats.set({
          libros: r.libros.length,
          clientes: r.clientes.length,
          categorias: r.categorias.length,
          reservas: r.reservas.length,
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}

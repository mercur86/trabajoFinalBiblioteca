import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Libro } from '../../../core/models/libro';
import { LibroService } from '../../../core/services/libro';
import { NotificationService } from '../../../core/ui/notification';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-libro-list',
  imports: [
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './libro-list.html',
  styleUrl: './libro-list.scss',
})
export class LibroList {

  private readonly service = inject(LibroService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  protected readonly items = signal<Libro[]>([]);
  protected readonly loading = signal(true);
  protected readonly displayedColumns = ['idLibro', 'titulo', 'autor', 'isbn', 'categoria', 'disponible', 'acciones'];
  protected readonly dataSource = new MatTableDataSource<Libro>();

  private readonly sort = viewChild(MatSort);
  private readonly paginator = viewChild(MatPaginator);

  constructor() {
    //el filtro también mira el nombre de la categoría
    this.dataSource.filterPredicate = (l, f) =>
      [l.titulo, l.autor, l.isbn, l.categoria?.nombre ?? ''].join(' ').toLowerCase().includes(f);

    effect(() => {
      this.dataSource.data = this.items();
      this.dataSource.sort = this.sort() ?? null;
      this.dataSource.paginator = this.paginator() ?? null;
    });
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.service.findAll().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  protected remove(item: Libro): void {
    if (item.idLibro == null) {
      return;
    }
    this.dialog
      .open(ConfirmDialog, {
        data: { title: 'Eliminar libro', message: `¿Eliminar el libro "${item.titulo}"?` },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.service.delete(item.idLibro!).subscribe({
          next: () => {
            this.items.update((list) => list.filter((l) => l.idLibro !== item.idLibro));
            this.notifications.success('Libro eliminado');
          },
        });
      });
  }
}

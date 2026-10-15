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
import { Categoria } from '../../../core/models/categoria';
import { CategoriaService } from '../../../core/services/categoria';
import { NotificationService } from '../../../core/ui/notification';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-categoria-list',
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
  templateUrl: './categoria-list.html',
  styleUrl: './categoria-list.scss',
})
export class CategoriaList {

  private readonly service = inject(CategoriaService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  protected readonly items = signal<Categoria[]>([]);
  protected readonly loading = signal(true);
  protected readonly displayedColumns = ['idCategoria', 'nombre', 'descripcion', 'estado', 'acciones'];
  protected readonly dataSource = new MatTableDataSource<Categoria>();

  private readonly sort = viewChild(MatSort);
  private readonly paginator = viewChild(MatPaginator);

  constructor() {
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

  protected remove(item: Categoria): void {
    if (item.idCategoria == null) {
      return;
    }
    this.dialog
      .open(ConfirmDialog, {
        data: { title: 'Eliminar categoría', message: `¿Eliminar la categoría "${item.nombre}"?` },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.service.delete(item.idCategoria!).subscribe({
          next: () => {
            this.items.update((list) => list.filter((c) => c.idCategoria !== item.idCategoria));
            this.notifications.success('Categoría eliminada');
          },
        });
      });
  }
}

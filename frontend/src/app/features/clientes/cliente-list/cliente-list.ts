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
import { Cliente } from '../../../core/models/cliente';
import { ClienteService } from '../../../core/services/cliente';
import { NotificationService } from '../../../core/ui/notification';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-cliente-list',
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
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.scss',
})
export class ClienteList {

  private readonly service = inject(ClienteService);
  private readonly notifications = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  protected readonly items = signal<Cliente[]>([]);
  protected readonly loading = signal(true);
  protected readonly displayedColumns = ['idCliente', 'nombres', 'apellidos', 'cedula', 'email', 'acciones'];
  protected readonly dataSource = new MatTableDataSource<Cliente>();

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

  protected remove(item: Cliente): void {
    if (item.idCliente == null) {
      return;
    }
    this.dialog
      .open(ConfirmDialog, {
        data: { title: 'Eliminar cliente', message: `¿Eliminar a "${item.nombres} ${item.apellidos}"?` },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.service.delete(item.idCliente!).subscribe({
          next: () => {
            this.items.update((list) => list.filter((c) => c.idCliente !== item.idCliente));
            this.notifications.success('Cliente eliminado');
          },
        });
      });
  }
}

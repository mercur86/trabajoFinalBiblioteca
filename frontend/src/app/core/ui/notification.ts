import { Service, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

// Notificaciones con MatSnackBar. El interceptor de errores y los componentes
// llaman a success/error; no hay estado propio que mostrar en la vista.
@Service()
export class NotificationService {

  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 6000,
      panelClass: 'snack-error',
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'OK', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}

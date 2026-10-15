import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from './notification';

// Toma el message del CustomErrorTemplate del backend y lo publica como toast.
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const backendMessage: string | undefined = error.error?.message;

      if (error.status === 0) {
        notifications.error('No se pudo conectar con el servidor.');
      } else {
        notifications.error(backendMessage ?? `Error ${error.status}`);
      }

      return throwError(() => error);
    }),
  );
};

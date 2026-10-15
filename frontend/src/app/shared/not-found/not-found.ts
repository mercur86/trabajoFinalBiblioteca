import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <section class="empty-state">
      <h1 class="empty-state__code">404</h1>
      <p>La página que buscas no existe.</p>
      <a mat-flat-button color="primary" routerLink="/dashboard">
        <mat-icon>home</mat-icon>
        Volver al inicio
      </a>
    </section>
  `,
})
export class NotFound {}

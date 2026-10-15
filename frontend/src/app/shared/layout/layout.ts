import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

  protected readonly navItems = [
    { path: '/dashboard', label: 'Panel', icon: 'dashboard' },
    { path: '/libros', label: 'Libros', icon: 'menu_book' },
    { path: '/clientes', label: 'Clientes', icon: 'group' },
    { path: '/categorias', label: 'Categorías', icon: 'category' },
    { path: '/reservas', label: 'Reservas', icon: 'event_note' },
  ];
}

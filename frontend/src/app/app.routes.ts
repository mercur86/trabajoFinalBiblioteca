import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'categorias',
        loadComponent: () => import('./features/categorias/categoria-list/categoria-list').then((m) => m.CategoriaList),
      },
      {
        path: 'categorias/nueva',
        loadComponent: () => import('./features/categorias/categoria-form/categoria-form').then((m) => m.CategoriaForm),
      },
      {
        path: 'categorias/:id/editar',
        loadComponent: () => import('./features/categorias/categoria-form/categoria-form').then((m) => m.CategoriaForm),
      },
      {
        path: 'libros',
        loadComponent: () => import('./features/libros/libro-list/libro-list').then((m) => m.LibroList),
      },
      {
        path: 'libros/nuevo',
        loadComponent: () => import('./features/libros/libro-form/libro-form').then((m) => m.LibroForm),
      },
      {
        path: 'libros/:id/editar',
        loadComponent: () => import('./features/libros/libro-form/libro-form').then((m) => m.LibroForm),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clientes/cliente-list/cliente-list').then((m) => m.ClienteList),
      },
      {
        path: 'clientes/nuevo',
        loadComponent: () => import('./features/clientes/cliente-form/cliente-form').then((m) => m.ClienteForm),
      },
      {
        path: 'clientes/:id/editar',
        loadComponent: () => import('./features/clientes/cliente-form/cliente-form').then((m) => m.ClienteForm),
      },
      {
        path: 'reservas',
        loadComponent: () => import('./features/reservas/reserva-list/reserva-list').then((m) => m.ReservaList),
      },
      {
        path: 'reservas/nueva',
        loadComponent: () => import('./features/reservas/reserva-form/reserva-form').then((m) => m.ReservaForm),
      },
      {
        path: '**',
        loadComponent: () => import('./shared/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];

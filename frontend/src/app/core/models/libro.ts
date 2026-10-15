import { Categoria } from './categoria';

export interface Libro {
  idLibro?: number;
  titulo: string;
  autor: string;
  isbn: string;
  disponible: boolean;
  categoria: Categoria;
}

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Categoria } from '../../../core/models/categoria';
import { Libro } from '../../../core/models/libro';
import { CategoriaService } from '../../../core/services/categoria';
import { LibroService } from '../../../core/services/libro';
import { NotificationService } from '../../../core/ui/notification';

@Component({
  selector: 'app-libro-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './libro-form.html',
  styleUrl: './libro-form.scss',
})
export class LibroForm {

  private readonly service = inject(LibroService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  protected readonly categorias = signal<Categoria[]>([]);
  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(150)] }),
    autor: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    isbn: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(20)] }),
    disponible: new FormControl(true, { nonNullable: true }),
    idCategoria: new FormControl<number | null>(null, Validators.required),
  });

  constructor() {
    this.categoriaService.findAll().subscribe((data) => this.categorias.set(data));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(Number(id));
      this.service.findById(Number(id)).subscribe((data) => {
        this.form.patchValue({
          titulo: data.titulo,
          autor: data.autor,
          isbn: data.isbn,
          disponible: data.disponible,
          idCategoria: data.categoria?.idCategoria ?? null,
        });
      });
    }
  }

  protected get titulo(): string {
    return this.editingId() ? 'Editar libro' : 'Nuevo libro';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const payload: Libro = {
      titulo: value.titulo,
      autor: value.autor,
      isbn: value.isbn,
      disponible: value.disponible,
      categoria: { idCategoria: value.idCategoria! } as Categoria,
    };
    const id = this.editingId();
    const request$ = id ? this.service.update(id, payload) : this.service.save(payload);

    request$.subscribe({
      next: () => {
        this.notifications.success(id ? 'Libro actualizado' : 'Libro registrado');
        this.router.navigate(['/libros']);
      },
      error: () => this.saving.set(false),
    });
  }
}

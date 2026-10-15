import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CategoriaService } from '../../../core/services/categoria';
import { NotificationService } from '../../../core/ui/notification';

@Component({
  selector: 'app-categoria-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './categoria-form.html',
  styleUrl: './categoria-form.scss',
})
export class CategoriaForm {

  private readonly service = inject(CategoriaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    descripcion: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    estado: new FormControl(true, { nonNullable: true }),
  });

  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(Number(id));
      this.service.findById(Number(id)).subscribe((data) => {
        this.form.patchValue({ nombre: data.nombre, descripcion: data.descripcion, estado: data.estado });
      });
    }
  }

  protected get titulo(): string {
    return this.editingId() ? 'Editar categoría' : 'Nueva categoría';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const id = this.editingId();
    const request$ = id ? this.service.update(id, value) : this.service.save(value);

    request$.subscribe({
      next: () => {
        this.notifications.success(id ? 'Categoría actualizada' : 'Categoría creada');
        this.router.navigate(['/categorias']);
      },
      error: () => this.saving.set(false),
    });
  }
}

import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClienteService } from '../../../core/services/cliente';
import { NotificationService } from '../../../core/ui/notification';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.scss',
})
export class ClienteForm {

  private readonly service = inject(ClienteService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  protected readonly editingId = signal<number | null>(null);
  protected readonly saving = signal(false);

  protected readonly form = new FormGroup({
    nombres: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    apellidos: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    cedula: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(15)] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editingId.set(Number(id));
      this.service.findById(Number(id)).subscribe((data) => {
        this.form.patchValue({
          nombres: data.nombres,
          apellidos: data.apellidos,
          cedula: data.cedula,
          email: data.email,
        });
      });
    }
  }

  protected get titulo(): string {
    return this.editingId() ? 'Editar cliente' : 'Nuevo cliente';
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
        this.notifications.success(id ? 'Cliente actualizado' : 'Cliente registrado');
        this.router.navigate(['/clientes']);
      },
      error: () => this.saving.set(false),
    });
  }
}

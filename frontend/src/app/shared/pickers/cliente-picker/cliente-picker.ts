import { Component, DestroyRef, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Cliente } from '../../../core/models/cliente';
import { ClienteService } from '../../../core/services/cliente';

//Selector de cliente con mat-autocomplete: busca en el backend (no carga toda la tabla).
@Component({
  selector: 'app-cliente-picker',
  imports: [ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Cliente</mat-label>
      <input type="text"
             matInput
             [formControl]="control"
             [matAutocomplete]="auto"
             placeholder="Escribe nombre, cédula o email"
             autocomplete="off" />
      <mat-autocomplete #auto="matAutocomplete" [displayWith]="display" (optionSelected)="select($event.option.value)">
        @for (c of results(); track c.idCliente) {
          <mat-option [value]="c">{{ c.nombres }} {{ c.apellidos }} — {{ c.cedula }}</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class ClientePicker {

  private readonly service = inject(ClienteService);
  private readonly destroyRef = inject(DestroyRef);

  readonly value = model<Cliente | null>(null);

  protected readonly control = new FormControl<string | Cliente>('', { nonNullable: true });
  protected readonly results = signal<Cliente[]>([]);

  constructor() {
    this.control.valueChanges
      .pipe(
        //mat-autocomplete puede escribir el objeto seleccionado en el control; solo
        //reaccionamos al texto que escribe el usuario
        filter((v): v is string => typeof v === 'string'),
        debounceTime(300),
        distinctUntilChanged(),
        //al vaciar el campo se quita la selección
        tap((term) => {
          if (term.trim().length < 2) {
            this.value.set(null);
          }
        }),
        switchMap((term) => {
          const query = term.trim();
          return query.length < 2 ? of([] as Cliente[]) : this.service.search(query);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((list) => this.results.set(list));
  }

  protected display = (value: Cliente | string | null): string => {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return `${value.nombres} ${value.apellidos} — ${value.cedula}`;
  };

  protected select(cliente: Cliente): void {
    this.value.set(cliente);
  }
}

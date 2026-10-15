import { Component, DestroyRef, ElementRef, inject, model, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, of, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Libro } from '../../../core/models/libro';
import { LibroService } from '../../../core/services/libro';

//Selector múltiple de libros: mat-autocomplete + chips (patrón de Material).
//Los elegidos se muestran como chips; el input se limpia tras cada selección.
@Component({
  selector: 'app-libro-picker',
  imports: [ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatIconModule],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>Libros</mat-label>

      <mat-chip-grid #chipGrid aria-label="Libros seleccionados">
        @for (l of value(); track l.idLibro) {
          <mat-chip-row (removed)="remove(l.idLibro!)">
            {{ l.titulo }}
            <button matChipRemove aria-label="Quitar"><mat-icon>cancel</mat-icon></button>
          </mat-chip-row>
        }
      </mat-chip-grid>

      <input #libroInput
             type="text"
             matInput
             [formControl]="control"
             [matAutocomplete]="auto"
             [matChipInputFor]="chipGrid"
             placeholder="Escribe título, autor o ISBN"
             autocomplete="off" />

      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="select($event.option.value)">
        @for (l of results(); track l.idLibro) {
          <mat-option [value]="l">{{ l.titulo }} — {{ l.autor }}</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class LibroPicker {

  private readonly service = inject(LibroService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('libroInput');

  readonly value = model<Libro[]>([]);

  protected readonly control = new FormControl<string | Libro>('', { nonNullable: true });
  protected readonly results = signal<Libro[]>([]);

  constructor() {
    this.control.valueChanges
      .pipe(
        //solo reaccionamos al texto del usuario, no al objeto que mat-autocomplete deja en el control
        filter((v): v is string => typeof v === 'string'),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const query = term.trim();
          return query.length < 2 ? of([] as Libro[]) : this.service.search(query);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((list) => this.results.set(list));
  }

  protected select(libro: Libro): void {
    if (libro.idLibro == null || this.value().some((l) => l.idLibro === libro.idLibro)) {
      return;
    }
    this.value.update((list) => [...list, libro]);
    this.results.set([]);
    //el input de un autocomplete con chips no se limpia solo: se hace a mano
    setTimeout(() => {
      this.control.setValue('', { emitEvent: false });
      const input = this.inputRef()?.nativeElement;
      if (input) {
        input.value = '';
      }
    });
  }

  protected remove(idLibro: number): void {
    this.value.update((list) => list.filter((l) => l.idLibro !== idLibro));
  }
}

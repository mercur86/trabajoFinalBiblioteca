# Design Guidelines — Frontend Biblioteca

## Purpose

Definir los estándares visuales de la SPA Angular de la Biblioteca.

> **Status**: el proyecto usa **Angular Material 3** con el mixin `mat.theme()`. Los estilos
> propios quedan reducidos a un puñado de helpers en `src/styles.scss`; el resto lo aporta
> Material a través de variables de sistema (`--mat-sys-*`).

---

# Theme

* **Tema**: Material 3, claro (`color-scheme: light`).
* **Definición**: `src/styles.scss` → `html { @include mat.theme(...) }`.
* **Paletas**: `primary: mat.$azure-palette`, `tertiary: mat.$blue-palette`.
* **Tipografía**: `Roboto` (cargada desde Google Fonts en `index.html`).
* **Densidad**: `0`.
* **Iconografía**: **Material Symbols Outlined** (cargada en `index.html`); `mat-icon`
  se configura con `MAT_ICON_DEFAULT_OPTIONS.fontSet = 'material-symbols-outlined'`.
* **Variables**: se consumen las de sistema (`--mat-sys-surface`, `--mat-sys-primary`,
  `--mat-sys-on-surface-variant`, `--mat-sys-error`, etc.), nunca colores fijos.

---

# Layout

* `mat-toolbar` (color primary) con botón de menú e ícono de marca.
* `mat-sidenav-container` con `mat-sidenav` (modo `side`) y `mat-nav-list`
  (`mat-list-item` + `mat-icon` + `routerLinkActive`).
* El contenido vive en `mat-sidenav-content` con `padding: 1.5rem`.
* Altura completa: `:host { height: 100dvh }` en el layout.

---

# Componentes

* **Tablas**: `mat-table` + `matSort` + `matPaginator` con `MatTableDataSource`; filtro con
  `mat-form-field` + `matInput` (`matPrefix` con ícono de búsqueda).
* **Formularios**: `mat-form-field appearance="outline"` + `matInput`, `mat-select`/`mat-option`,
  `mat-checkbox`; errores con `mat-error`.
* **Fechas**: `mat-datepicker` (calendario) para la fecha y un `input type="time"` para la hora;
  se combinan a `LocalDateTime` (`yyyy-MM-ddTHH:mm:00`) al guardar. Requiere
  `provideNativeDateAdapter()` en la config.
* **Botones**: `mat-flat-button` (primario), `mat-stroked-button` (secundario/peligro),
  `mat-icon-button` (acciones de fila).
* **Autocompletado**: `mat-autocomplete` + `mat-option` para los buscadores.
  * Cliente (`ClientePicker`): selección simple; el input muestra el cliente elegido.
  * Libros (`LibroPicker`): selección múltiple con `mat-chip-grid`/`mat-chip-row`; el input
    se limpia tras cada selección (patrón autocomplete + chips).
* **Notificaciones**: `MatSnackBar` (`NotificationService`); clase `snack-error` para errores.
* **Confirmaciones**: `MatDialog` (`ConfirmDialog`) para borrados.
* **Panel**: `mat-card` con `--mat-sys-primary` para el número.

---

# Helpers propios (styles.scss)

Solo lo que Material no cubre: `.page`/`.page__*` (cabecera de pantalla), `.form-card`,
`.form-actions`, `.badge` (`--yes`/`--no` con tokens de sistema), `.stat-*`, `.empty-state`,
`.loading`, `.snack-error`.

---

# Accesibilidad

* `aria-label` en botones de ícono (menú, editar, eliminar, quitar chip, paginador).
* Contraste provisto por los tokens de Material 3 (WCAG AA).
* Foco visible provisto por Material.

---

# Principios

* **Consistencia**: todo el UI se construye con componentes de Material 3 y sus tokens.
* **Escalabilidad**: los selectores grandes usan búsqueda (`mat-autocomplete`), no listas completas.
* **Simplicidad**: sin CSS a medida salvo helpers puntuales.

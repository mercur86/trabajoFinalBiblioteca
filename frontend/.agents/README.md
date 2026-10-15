# Agentes y specs — Frontend (Angular 22)

Configuración de IA del proyecto **frontend**. Las specs de backend viven en
`backend/.agents/` y las compartidas en `.agents/` (raíz).

## Specs (`features/`)

Una spec por pantalla, con `spec/spec.md`:

| Spec | Pantalla |
| --- | --- |
| [`panel`](features/panel/spec/spec.md) | Panel con conteos |
| [`crud-categorias`](features/crud-categorias/spec/spec.md) | Listar/crear/editar/eliminar categorías |
| [`crud-libros`](features/crud-libros/spec/spec.md) | CRUD de libros |
| [`crud-clientes`](features/crud-clientes/spec/spec.md) | CRUD de clientes |
| [`registro-reserva`](features/registro-reserva/spec/spec.md) | Registrar reserva (búsqueda de cliente y libros) |
| [`listado-reservas`](features/listado-reservas/spec/spec.md) | Listar reservas y filtrar por cliente |

## Docs (`docs/`)

* [`design.md`](docs/design.md) — guía visual (tokens, layout, componentes).

## Subagentes (`subagents/`)

* [`angular-frontend-builder`](subagents/angular-frontend-builder.md) — construye pantallas y servicios.

## Convenciones

* Angular 22, componentes **standalone** (sin `standalone: true`), **lazy loading** por feature.
* **Angular Material 3** para el UI (tablas, formularios, autocompletado, snackbar, diálogos).
* **Signals**, `computed()`; `inject()` en lugar de constructor.
* Decorador `@Service()` para servicios singleton que extienden `GenericService<T>`.
* Control flow nativo (`@if`, `@for`); sin `ngClass`/`ngStyle`.
* **Reactive Forms** en los formularios.
* Estilos con SCSS: los componentes de Material + pocos helpers en `src/styles.scss`.
* Errores HTTP → `NotificationService` (MatSnackBar) vía interceptor global.

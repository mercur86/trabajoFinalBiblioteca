# CRUD de Libros

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `frontend` |
| **Afecta** | `features/libros` |
| **Requisito** | Pantalla para listar, registrar, editar y eliminar libros |

## Objetivo

Listar, registrar, editar y eliminar **libros** contra `GET/POST/PUT/DELETE /v1/libros`.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/libros` | Listado con acciones |
| `/libros/nuevo` | Formulario de alta |
| `/libros/:id/editar` | Formulario de edición |

## Campos y validación

| Campo | Tipo | Validación en cliente |
| --- | --- | --- |
| `titulo` | text | requerido, máx. 150 |
| `autor` | text | requerido, máx. 100 |
| `isbn` | text | requerido, máx. 20 |
| `disponible` | checkbox | — (disponible por defecto) |
| `categoria` | select | requerido; se cargan `GET /v1/categorias` |

## Contrato

* `GET /v1/libros` → tabla con título, autor, ISBN, **nombre de categoría** y disponible.
* `POST /v1/libros` / `PUT /v1/libros/{id}` → vuelve al listado con toast de éxito.
* `DELETE /v1/libros/{id}` → confirmación y refresco.
* **Filtro local** por título/autor/ISBN sobre la lista ya cargada.

## Archivos

* `features/libros/libro-list/libro-list.ts|html`
* `features/libros/libro-form/libro-form.ts|html`
* `core/services/libro.ts`, `core/services/categoria.ts`

## Verificación

* Listado mostrando la categoría de cada libro; alta/edición/eliminación funcionando.

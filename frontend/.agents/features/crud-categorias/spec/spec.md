# CRUD de Categorías

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `frontend` |
| **Afecta** | `features/categorias` |
| **Requisito** | Pantalla para administrar categorías |

## Objetivo

Listar, registrar, editar y eliminar **categorías** contra `GET/POST/PUT/DELETE /v1/categorias`.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/categorias` | Listado con acciones |
| `/categorias/nueva` | Formulario de alta |
| `/categorias/:id/editar` | Formulario de edición (carga la categoría por id) |

## Campos y validación

| Campo | Tipo | Validación en cliente |
| --- | --- | --- |
| `nombre` | text | requerido, máx. 100 |
| `descripcion` | textarea | requerido, máx. 200 |
| `estado` | checkbox | — (activa por defecto) |

## Contrato

* `GET /v1/categorias` → tabla (id, nombre, descripción, estado).
* `POST /v1/categorias` / `PUT /v1/categorias/{id}` → vuelve al listado con toast de éxito.
* `DELETE /v1/categorias/{id}` → confirmación y refresco de la lista.

## Archivos

* `features/categorias/categoria-list/categoria-list.ts|html`
* `features/categorias/categoria-form/categoria-form.ts|html`
* `core/services/categoria.ts`

## Verificación

* Alta desde el formulario → aparece en la tabla y toast "Categoría creada".

# CRUD de Clientes

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `frontend` |
| **Afecta** | `features/clientes` |
| **Requisito** | Pantalla para listar, registrar, editar y eliminar clientes |

## Objetivo

Listar, registrar, editar y eliminar **clientes** contra `GET/POST/PUT/DELETE /v1/clientes`.

## Rutas

| Ruta | Pantalla |
| --- | --- |
| `/clientes` | Listado con acciones |
| `/clientes/nuevo` | Formulario de alta |
| `/clientes/:id/editar` | Formulario de edición |

## Campos y validación

| Campo | Tipo | Validación en cliente |
| --- | --- | --- |
| `nombres` | text | requerido, máx. 100 |
| `apellidos` | text | requerido, máx. 100 |
| `cedula` | text | requerido, máx. 15 |
| `email` | email | requerido, formato email, máx. 100 |

## Contrato

* `GET /v1/clientes` → tabla (id, nombres, apellidos, cédula, email).
* `POST /v1/clientes` / `PUT /v1/clientes/{id}` → vuelve al listado con toast de éxito.
* `DELETE /v1/clientes/{id}` → confirmación y refresco.

## Archivos

* `features/clientes/cliente-list/cliente-list.ts|html`
* `features/clientes/cliente-form/cliente-form.ts|html`
* `core/services/cliente.ts`

## Verificación

* Alta desde el formulario → aparece en la tabla y toast "Cliente registrado".

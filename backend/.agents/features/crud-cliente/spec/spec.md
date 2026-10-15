# CRUD de Cliente (backend)

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `biblioteca-backend` |
| **Afecta** | `model/Cliente`, `dto/ClienteDTO`, `repository/IClienteRepo`, `service/IClienteService`, `service/impl/ClienteServiceImpl`, `controller/ClienteController` |
| **Requisito** | CRUD de Cliente |

> Contraparte de UI: `frontend/.agents/features/crud-clientes`. Entidad en `modelo-datos`.
> Búsqueda: spec `busqueda`.

## Objetivo

Exponer el CRUD REST de **Cliente** bajo `/v1/clientes`.

## DTO y validación

| Campo | Regla |
| --- | --- |
| `idCliente` | ignorado en create |
| `nombres` | `@NotBlank @Size(max=100)` |
| `apellidos` | `@NotBlank @Size(max=100)` |
| `cedula` | `@NotBlank @Size(max=15)`, única |
| `email` | `@NotBlank @Email @Size(max=100)`, único |

## Endpoints

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/v1/clientes` | `200` lista |
| GET | `/v1/clientes/{id}` | `200` o `404` |
| POST | `/v1/clientes` | `201` + `Location` |
| PUT | `/v1/clientes/{id}` | `200` |
| DELETE | `/v1/clientes/{id}` | `204` |
| GET | `/v1/clientes/search?term=` | `200` (búsqueda) |

## Parte 2 — Implementación

* Update por reflexión `setIdCliente`; `defaultMapper` para el mapeo.
* `cedula` y `email` son `unique`: un duplicado lo rechaza la base (500 en el handler global).
* Verificado: alta, edición, listado y búsqueda por nombre.

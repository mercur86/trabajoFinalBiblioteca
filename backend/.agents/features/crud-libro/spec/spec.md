# CRUD de Libro (backend)

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `biblioteca-backend` |
| **Afecta** | `model/Libro`, `dto/LibroDTO`, `repository/ILibroRepo`, `service/ILibroService`, `service/impl/LibroServiceImpl`, `controller/LibroController` |
| **Requisito** | CRUD de Libro |

> Contraparte de UI: `frontend/.agents/features/crud-libros`. Entidad en `modelo-datos`.
> Búsqueda combinada: spec `busqueda`.

## Objetivo

Exponer el CRUD REST de **Libro** bajo `/v1/libros`, con su relación a **Categoría**.

## DTO y validación

| Campo | Regla |
| --- | --- |
| `idLibro` | ignorado en create |
| `titulo` | `@NotBlank @Size(max=150)` |
| `autor` | `@NotBlank @Size(max=100)` |
| `isbn` | `@NotBlank @Size(max=20)`, único |
| `disponible` | `@NotNull` |
| `categoria` | `@NotNull` — **solo se lee `idCategoria`** (sin `@Valid` en cascada) |

## Endpoints

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/v1/libros` | `200` lista (incluye categoría) |
| GET | `/v1/libros/{id}` | `200` o `404` |
| POST | `/v1/libros` | `201` + `Location` |
| PUT | `/v1/libros/{id}` | `200` |
| DELETE | `/v1/libros/{id}` | `204` |
| GET | `/v1/libros/search/titulo?titulo=` | `200` |
| GET | `/v1/libros/search/autor?autor=` | `200` |
| GET | `/v1/libros/search/disponible?disponible=` | `200` |
| GET | `/v1/libros/search?term=` | `200` (combinada) |

## Reglas de negocio

* En `save`, si `categoria` o `idCategoria` vienen nulos → `IllegalArgumentException` (`400`)
  antes de escribir nada.

## Parte 2 — Implementación

* Update por reflexión `setIdLibro`; `defaultMapper` para el mapeo.
* Verificado: alta con categoría existente, listado con nombre de categoría, borrado y 404.

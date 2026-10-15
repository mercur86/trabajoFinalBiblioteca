# CRUD de Categoría (backend)

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `biblioteca-backend` |
| **Afecta** | `model/Categoria`, `dto/CategoriaDTO`, `repository/ICategoriaRepo`, `service/ICategoriaService`, `service/impl/CategoriaServiceImpl`, `controller/CategoriaController` |
| **Requisito** | CRUD de Categoría |

> Contraparte de UI: `frontend/.agents/features/crud-categorias`. Entidad en `modelo-datos`.

## Objetivo

Exponer el CRUD REST de **Categoría** bajo `/v1/categorias`.

## DTO y validación

| Campo | Regla |
| --- | --- |
| `idCategoria` | ignorado en create (se fuerza a `null`) |
| `nombre` | `@NotBlank @Size(max=100)` |
| `descripcion` | `@NotBlank @Size(max=200)` |
| `estado` | `@NotNull` |

## Endpoints

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/v1/categorias` | `200` lista de `CategoriaDTO` |
| GET | `/v1/categorias/{id}` | `200` o `404` |
| POST | `/v1/categorias` | `201` + `Location` |
| PUT | `/v1/categorias/{id}` | `200` |
| DELETE | `/v1/categorias/{id}` | `204` |
| GET | `/v1/categorias/hateoas/{id}` | `200` EntityModel |

## Parte 2 — Implementación

* Sigue la abstracción `IGenericRepo` / `ICRUD` / `CRUDImpl` (update por reflexión `setIdCategoria`).
* Mapeo con `defaultMapper` (ModelMapper).
* Verificado: alta, listado, actualización y eliminación.

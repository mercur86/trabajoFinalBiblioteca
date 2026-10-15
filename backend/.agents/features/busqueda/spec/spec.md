# Búsqueda de Clientes y Libros (backend)

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `biblioteca-backend` |
| **Afecta** | `repository/IClienteRepo`, `repository/ILibroRepo`, `service/IClienteService`, `service/ILibroService`, `controller/ClienteController`, `controller/LibroController` |
| **Requisito** | Búsquedas por término para los selectores del frontend |

> Consumida por los *pickers* del frontend (`frontend/.agents/features/registro-reserva`).

## Objetivo

Ofrecer búsquedas por término para que el frontend **no tenga que cargar tablas enteras**
en los selectores (un cliente o un libro entre miles).

## Endpoints

| Método | Ruta | Coincide con |
| --- | --- | --- |
| GET | `/v1/clientes/search?term=` | nombres, apellidos, cédula o email (`LIKE %term%`, case-insensitive) |
| GET | `/v1/libros/search?term=` | título, autor o ISBN (`LIKE %term%`, case-insensitive) |

Devuelven `200` con la lista de coincidencias (puede ser vacía). No hay mínimo de longitud
en el backend; el frontend exige 2 letras antes de consultar.

## Implementación

* Consultas JPQL con `LOWER(...) LIKE LOWER(CONCAT('%', :term, '%'))` en `@Query`
  (`searchByTerm`), ordenadas por apellidos/nombres (clientes) y por título (libros).
* Verificado: `/clientes/search?term=gomez` y `/libros/search?term=perros` devuelven las
  coincidencias; el frontend usa estos endpoints con debounce.

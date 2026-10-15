# Panel (Dashboard)

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `frontend` |
| **Afecta** | `features/dashboard` |
| **Requisito** | Pantalla de inicio con el resumen del sistema |

## Objetivo

Pantalla de inicio que resume cuántos **libros**, **clientes**, **categorías** y **reservas**
hay en el sistema, para confirmar de un vistazo que el frontend está integrado con el backend.

## Contrato

* Ruta `/dashboard` (la raíz `/` redirige aquí).
* Al montar, lanza en paralelo `GET /v1/libros`, `/v1/clientes`, `/v1/categorias`, `/v1/reservas`
  (`forkJoin`) y muestra una tarjeta por recurso con el conteo total.
* Estado de carga (`loading`) mientras responden.

## Archivos

* `features/dashboard/dashboard/dashboard.ts`
* `features/dashboard/dashboard/dashboard.html`

## Verificación

* Con datos reales el panel mostró los conteos correctos (2 libros, 1 cliente, 1 categoría, 1 reserva).

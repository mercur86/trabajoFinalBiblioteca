# Listado de Reservas

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `frontend` |
| **Afecta** | `features/reservas/reserva-list` |
| **Requisito** | Pantalla para listar las reservas realizadas |

## Objetivo

Listar las reservas mostrando como mínimo **fecha, cliente y libros reservados**, y
permitir consultar las reservas de un cliente.

## Ruta

`/reservas`

## Contrato

* Sin filtro: `GET /v1/reservas` → tabla con fecha, cliente y los títulos como *chips*.
* Con filtro: `GET /v1/reservas/cliente/{idCliente}`.
* El filtro por cliente usa el **`ClientePicker`** (con buscador), no un `<select>` con
  todos los clientes; al limpiar la selección vuelve a mostrar todas las reservas.
* La fecha se formatea con `toLocaleString('es-PE')`.

## Archivos

* `features/reservas/reserva-list/reserva-list.ts|html`
* `shared/pickers/cliente-picker/cliente-picker.ts`
* `core/services/reserva.ts`

## Verificación

* Listado con fecha, cliente y libros; al seleccionar un cliente en el filtro quedaron
  solo sus reservas.

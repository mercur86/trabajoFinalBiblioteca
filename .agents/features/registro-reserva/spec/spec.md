# Registro de Reserva — una reserva con uno o más libros en una sola transacción

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | Full-stack: `biblioteca-backend` + `frontend` |
| **Afecta** | Backend: `ReservaController`, `IReservaService`, `ReservaServiceImpl`, `ReservaDTO`, `DetalleReservaDTO`, `IReservaRepo`. Frontend: `features/reservas/reserva-form`, `shared/pickers`. |
| **Requisito** | Registrar una reserva con uno o más libros (backend y frontend) |

> Spec **compartida** (full-stack). Aquí se detalla el backend (transacción y contrato).
> La pantalla de registro —con buscadores de cliente y libros— está en la spec de
> frontend `frontend/.agents/features/registro-reserva/spec/spec.md`.

---

# Parte 1 — Especificación

## Problema

Registrar una reserva no es insertar una fila: es una fila `reserva`, más N filas
`detalle_reserva`. El cliente elige un título y a continuación, en la misma pantalla,
selecciona uno o más libros. No existe una pantalla donde se guarde primero la reserva
y los libros se cuelguen después.

Si la reserva y sus detalles se escribieran en dos llamadas separadas, el modo de fallo
sería silencioso: la primera llama y comitea, la segunda nunca llega y la base queda con
una reserva que no reservó nada.

## Objetivo

Un único `POST /v1/reservas` que reciba cliente, fecha y la lista de libros, y persista
la reserva y todos sus `DetalleReserva` **en una sola transacción, o no escriba nada**.

## Alcance

Dentro:

* `POST /v1/reservas` con `ReservaDTO` (cliente + `fechaReserva` + `detalles[]`).
* Persistencia en cascada de los detalles (`CascadeType.ALL` en `Reserva.detalles`).
* Validación del payload con `@Valid` (`@NotEmpty` en la lista de detalles, `@NotNull`
  en la fecha y en las referencias).
* `GET /v1/reservas` — lista mostrando **fecha, cliente y libros reservados**.
* `GET /v1/reservas/cliente/{idCliente}` — reservas de un cliente.

Fuera:

* Devoluciones, multas, pagos e inventario avanzado (explícitamente fuera de alcance).
* Cambiar `Libro.disponible` de forma automática al reservar. `disponible` es un campo
  de mantenimiento del CRUD de Libro; la reserva no lo toca.
* Crear cliente o libros desde este endpoint: cada id apunta a una fila que ya existe.

## Decisiones

**El detalle viaja anidado, no como una lista de ids aparte.**
`ReservaDTO.detalles` es `List<DetalleReservaDTO>`, y cada detalle lleva un `LibroDTO`
con solo `idLibro`. El modelo `Reserva` ya posee la colección, así que la cascada `ALL`
inserta los detalles junto con la reserva. No hace falta un segundo repositorio ni una
segunda transacción.

**De las referencias solo se lee el id.**
`cliente` viaja como `ClienteDTO` y el detalle como `LibroDTO`, pero solo importan
`idCliente` / `idLibro`. Por eso **no** se pone `@Valid` sobre ellos: una validación en
cascada exigiría enviar nombres, email, título, autor, ISBN, etc., que el cliente no
tiene por qué reenviar. La presencia se garantiza con `@NotNull` y el id no nulo se
valida en el servicio (400), antes de abrir cualquier insert.

**El back-reference no se expone en el DTO.**
`DetalleReserva.reserva` es el lado dueño de la FK `id_reserva`. Si `DetalleReservaDTO`
repitiera ese campo, el JSON ciclaría y ModelMapper recursaría. El DTO lo omite y el
controlador enlaza `detalle.setReserva(entity)` a mano antes de guardar.

**Una reserva exige al menos un libro.**
`detalles` es `@NotEmpty`: una reserva sin libros es un 400. El servicio además rechaza
un detalle cuyo `idLibro` sea nulo.

**Un id inexistente lo rechaza la foreign key.**
`fk_reserva_cliente` o `fk_detalle_libro` fallan, la transacción hace rollback y no
sobrevive una reserva huérfana. El `ResponseExceptionHandler` lo devuelve como 500.

## Contrato del request

**`ReservaDTO`**

| Campo | Tipo | Validación | Notas |
| --- | --- | --- | --- |
| `idReserva` | Integer | — | ignorado en create; forzado a `null` |
| `fechaReserva` | LocalDateTime | `@NotNull` | |
| `cliente` | `ClienteDTO` | `@NotNull` | solo se lee `idCliente` |
| `detalles` | `List<DetalleReservaDTO>` | `@NotEmpty` `@Valid` | persistidos por cascada |

**`DetalleReservaDTO`**: `idDetalle` (ignorado en create) y `libro` (`@NotNull`, solo `idLibro`).

Ejemplo:

```json
{
  "fechaReserva": "2026-10-05T10:30:00",
  "cliente": { "idCliente": 1 },
  "detalles": [
    { "libro": { "idLibro": 1 } },
    { "libro": { "idLibro": 2 } }
  ]
}
```

## Contrato del endpoint

| | |
| --- | --- |
| **Método** | `POST` |
| **Ruta** | `/v1/reservas` |
| **Body** | `ReservaDTO` |
| **Éxito** | `201 Created`, `Location: /v1/reservas/{idReserva}`, cuerpo vacío |

| Error | Status | Causa |
| --- | --- | --- |
| falta `fechaReserva`/`cliente`, o `detalles` vacío | 400 | `MethodArgumentNotValidException` |
| detalle con `libro`/`idLibro` nulo | 400 | `IllegalArgumentException` del servicio |
| `idCliente` o `idLibro` inexistente | 500 | violación de FK, rollback |

En todos los fallos **no se escribe nada**.

## Flujo de persistencia

```
  ReservaController.save(ReservaDTO)
      |  convertToEntity: mapper + detalle.setReserva(entity) en cada elemento
      |  entity.setIdReserva(null)
      v
  IReservaService.save(entity)                         @Transactional
      |  1. guardas de negocio (cliente con id, detalles no vacíos, idLibro no nulo)
      |  2. repo.save(reserva)  -> insert reserva
      |                            insert detalle_reserva[]  (cascade ALL)
      v
  Reserva (con id) -> 201 + Location
```

---

# Parte 2 — Notas de implementación

**Fecha** 2026-10-05 · **Status** implementado y verificado contra PostgreSQL local.

## Archivos

| Archivo | Rol |
| --- | --- |
| `model/Reserva.java` | `reserva`, FK `fk_reserva_cliente`, `detalles` cascade ALL |
| `model/DetalleReserva.java` | `detalle_reserva`, FKs `fk_detalle_reserva` y `fk_detalle_libro` |
| `dto/ReservaDTO.java` | request/response de la reserva |
| `dto/DetalleReservaDTO.java` | detalle anidado (solo `libro`) |
| `repository/IReservaRepo.java` | `findAllWithDetails`, `findByClienteWithDetails` (JOIN FETCH, evita N+1) |
| `service/impl/ReservaServiceImpl.java` | validaciones + `@Transactional` + listados |
| `controller/ReservaController.java` | endpoints y conversión |

## Verificación

Contra PostgreSQL 17 de Supabase local (`127.0.0.1:54322`):

* `POST /v1/reservas` con dos libros → `201`, una fila `reserva` y dos `detalle_reserva`.
* `GET /v1/reservas` → fecha, cliente completo y los dos libros con su categoría.
* `GET /v1/reservas/cliente/1` → las reservas del cliente.
* `detalles: []` → `400`; `libro` sin `idLibro` → `400`; libro sin `idCategoria` → `400`.
* `GET /v1/libros/999999` → `404`.

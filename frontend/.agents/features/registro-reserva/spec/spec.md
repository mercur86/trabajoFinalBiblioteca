# Registro de Reserva

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `frontend` |
| **Afecta** | `features/reservas/reserva-form`, `shared/pickers` |
| **Requisito** | Registrar una reserva seleccionando un cliente y uno o más libros |

## Objetivo

Pantalla para registrar una **reserva** eligiendo un cliente y **uno o más** libros, y
enviarla en una sola llamada a `POST /v1/reservas`.

## Escalabilidad (punto clave)

No se cargan todos los clientes ni todos los libros: eso no escala a miles de registros.
Se usan dos componentes **picker** con buscador:

* **`ClientePicker`** — selección simple; consulta `GET /v1/clientes/search?term=` con
  debounce de 300 ms y muestra coincidencias (nombres, apellidos, cédula, email).
* **`LibroPicker`** — selección múltiple; consulta `GET /v1/libros/search?term=` (título,
  autor, ISBN) y acumula los elegidos como *chips* removibles.

Ambos usan `debounceTime(300)` + `switchMap` sobre un `Subject`, y solo consultan con 2+ letras.

## Ruta

`/reservas/nueva`

## Contrato

```json
{
  "fechaReserva": "2026-10-05T11:01:00",
  "cliente": { "idCliente": 2 },
  "detalles": [
    { "libro": { "idLibro": 2 } },
    { "libro": { "idLibro": 1 } }
  ]
}
```

* `fechaReserva` se elige con **`mat-datepicker`** (calendario) y una **hora** aparte
  (`input type="time"`); se combinan a `yyyy-MM-ddTHH:mm:00` al enviar.
* Validación: cliente obligatorio y **al menos un libro**; si no, toast de error.
* Éxito → toast "Reserva registrada" y navegación a `/reservas`.

## Archivos

* `features/reservas/reserva-form/reserva-form.ts|html`
* `shared/pickers/cliente-picker/cliente-picker.ts`
* `shared/pickers/libro-picker/libro-picker.ts`
* `core/services/reserva.ts`, `core/services/cliente.ts`, `core/services/libro.ts`

## Verificación

* Se buscó el cliente "gomez", se agregaron "perros" y "soledad", y la reserva quedó
  registrada con los dos libros.

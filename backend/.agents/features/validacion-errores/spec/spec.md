# Validación y Manejo Global de Excepciones

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `biblioteca-backend` |
| **Afecta** | `dto/*`, `exception/*`, `config/MessageConfig`, `messages.properties` |
| **Requisito** | Validar los requests con `@Valid` e implementar el control global de excepciones |

---

# Parte 1 — Especificación

## Objetivo

Que todo error de cliente (payload inválido, recurso inexistente, regla de negocio)
devuelva un **JSON de error uniforme y un código HTTP correcto**, y que los errores
inesperados queden contenidos en un único manejador.

## Estructura del error

`CustomErrorTemplate` (record):

```java
public record CustomErrorTemplate(
        LocalDateTime datetime,
        String message,
        String details
) {}
```

Ejemplo de respuesta `400`:

```json
{
  "datetime": "2026-10-05T10:30:00.123",
  "message": "detalles: must not be empty",
  "details": "uri=/v1/reservas"
}
```

## Validación de requests

* `@Valid` en el `@RequestBody` de todos los `POST` y `PUT`.
* Reglas por DTO:

| DTO | Campo | Regla |
| --- | --- | --- |
| `CategoriaDTO` | `nombre` | `@NotBlank @Size(max=100)` → `{categoria.nombre.size}` |
| | `descripcion` | `@NotBlank @Size(max=200)` → `{categoria.descripcion.size}` |
| | `estado` | `@NotNull` |
| `LibroDTO` | `titulo` | `@NotBlank @Size(max=150)` → `{libro.titulo.size}` |
| | `autor` | `@NotBlank @Size(max=100)` → `{libro.autor.size}` |
| | `isbn` | `@NotBlank @Size(max=20)` → `{libro.isbn.size}` |
| | `disponible` | `@NotNull` |
| | `categoria` | `@NotNull` (solo se lee el id, sin `@Valid`) |
| `ClienteDTO` | `nombres`/`apellidos` | `@NotBlank @Size(max=100)` |
| | `cedula` | `@NotBlank @Size(max=15)` |
| | `email` | `@NotBlank @Email @Size(max=100)` |
| `ReservaDTO` | `fechaReserva` | `@NotNull` |
| | `cliente` | `@NotNull` (solo se lee el id, sin `@Valid`) |
| | `detalles` | `@NotEmpty @Valid` |
| `DetalleReservaDTO` | `libro` | `@NotNull` (solo se lee el id, sin `@Valid`) |

**Regla de diseño**: cuando un DTO referencia una fila existente, **no** se propaga
`@Valid` a ese DTO anidado. Se envía solo el id y el servicio valida que no sea nulo
(`IllegalArgumentException` → 400). Así no se obliga al cliente a reenviar campos que
no necesita.

## Mapa de excepciones → HTTP

`ResponseExceptionHandler` (`@RestControllerAdvice`):

| Excepción | Status | Origen |
| --- | --- | --- |
| `ModelNotFoundException` | **404** | `CRUDImpl.findById` cuando el id no existe |
| `IllegalArgumentException` | **400** | reglas de negocio en los servicios |
| `DateTimeParseException` | **400** | fechas mal formadas en query params |
| `MethodArgumentNotValidException` | **400** | fallo de `@Valid` (incluye el detalle por campo) |
| `HttpMediaTypeNotSupportedException` | **415** | `Content-Type` no soportado |
| `Exception` (resto) | **500** | fallback; incluye violaciones de FK/UNIQUE |

El mensaje de `MethodArgumentNotValidException` se arma concatenando
`campo + ": " + mensaje` de cada `FieldError`.

## Mensajes parametrizados

`MessageConfig` registra un `MessageSource` sobre `classpath:messages` y un
`LocalValidatorFactoryBean` que resuelve las claves `{...}` de las anotaciones.
`LanguageController` (`GET /v1/languages/change/{language}`) permite cambiar el locale.

## Fuera de alcance

* Traducir las violaciones de integridad de la base (FK/UNIQUE) a 409/404: hoy caen en
  el fallback 500. Es una mejora concreta y acotada (un `@ExceptionHandler` para
  `DataIntegrityViolationException`), deliberadamente fuera de esta iteración.

---

# Parte 2 — Notas de implementación

**Fecha** 2026-10-05 · **Status** implementado y verificado.

* `MethodArgumentNotValidException` se maneja con `@ExceptionHandler` (no extendiendo
  `ResponseEntityExceptionHandler`).
* Verificado con la colección Postman: payload vacío → 400, referencia nula → 400,
  id inexistente → 404.
* El fallback `Exception` deja el mensaje crudo de Hibernate en `message` para facilitar
  el diagnóstico en desarrollo; no exponerlo en producción.

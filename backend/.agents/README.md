# Agentes y specs — Backend (Spring Boot)

Configuración de IA del proyecto **backend**. Las specs de frontend viven en
`frontend/.agents/` y las compartidas en `.agents/` (raíz).

## Specs (`features/`)

| Spec | Contenido |
| --- | --- |
| [`modelo-datos`](features/modelo-datos/spec/spec.md) | Entidades JPA, relaciones, convenciones y SQL de respaldo |
| [`crud-categoria`](features/crud-categoria/spec/spec.md) | CRUD REST de Categoría |
| [`crud-libro`](features/crud-libro/spec/spec.md) | CRUD REST de Libro (con su categoría) |
| [`crud-cliente`](features/crud-cliente/spec/spec.md) | CRUD REST de Cliente |
| [`busqueda`](features/busqueda/spec/spec.md) | Búsquedas por término (clientes y libros) |
| [`validacion-errores`](features/validacion-errores/spec/spec.md) | Validación `@Valid` y manejo global de excepciones |
| [`postman-testing`](features/postman-testing/spec/spec.md) | Colección Postman/Newman y su verificación |

> La arquitectura y el modelo de datos global están en la spec compartida
> [`proyecto-base`](../../.agents/features/proyecto-base/spec/spec.md), y el registro de
> reserva (full-stack) en [`registro-reserva`](../../.agents/features/registro-reserva/spec/spec.md).

## Subagentes (`subagents/`)

* [`spring-biblioteca-builder`](subagents/spring-biblioteca-builder.md) — construye/amplía verticales.
* [`spring-api-reviewer`](subagents/spring-api-reviewer.md) — revisa y clasifica hallazgos.
* [`spring-test-data-generator`](subagents/spring-test-data-generator.md) — escribe payloads de `testdata/`.

## Workflows (`workflows/`)

* [`generate-full-entity-flow`](workflows/generate-full-entity-flow.md) — construir → revisar → poblar.

## Convenciones

* Paquete `com.biblioteca`; capas `model → dto → repository → service → service.impl → controller`.
* Lombok, `@RequiredArgsConstructor` e inyección por constructor.
* FKs `@ManyToOne` con `@ForeignKey` nombrada en minúsculas.
* Java 25 / Spring Boot 4.1.1. Compilar con `JAVA_HOME` apuntando al JDK 25.

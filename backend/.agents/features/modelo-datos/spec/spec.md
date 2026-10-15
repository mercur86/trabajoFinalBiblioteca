# Modelo de Datos — entidades JPA

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `biblioteca-backend` |
| **Afecta** | `model/*`, `resources/schema-backup.sql` |
| **Requisito** | Entidades mínimas: Categoría, Libro, Cliente, Reserva y DetalleReserva |

> Los CRUD de cada entidad tienen su propia spec: `crud-categoria`, `crud-libro`,
> `crud-cliente`. La reserva (full-stack) está en `.agents/features/registro-reserva`.

---

# Parte 1 — Especificación

## Objetivo

Modelar las entidades mínimas del sistema con JPA y dejar el esquema reconstruible sin
arrancar la aplicación.

## Entidades y relaciones

| Entidad | Tabla | Campos | Relación |
| --- | --- | --- | --- |
| `Categoria` | `categoria` | idCategoria (identity), nombre(100), descripcion(200), estado(boolean) | — |
| `Libro` | `libro` | idLibro (identity), titulo(150), autor(100), isbn(20, único), disponible(boolean) | `@ManyToOne` → Categoria, `fk_libro_categoria` |
| `Cliente` | `cliente` | idCliente (identity), nombres(100), apellidos(100), cedula(15, única), email(100, único) | — |
| `Reserva` | `reserva` | idReserva (identity), fechaReserva | `@ManyToOne` → Cliente, `fk_reserva_cliente`; `@OneToMany` → DetalleReserva (cascade ALL) |
| `DetalleReserva` | `detalle_reserva` | idDetalle (identity) | `@ManyToOne` → Reserva (`fk_detalle_reserva`) y → Libro (`fk_detalle_libro`) |

* Un **Libro** pertenece a una **Categoría**.
* Una **Reserva** pertenece a un **Cliente**.
* Una **Reserva** contiene uno o más **DetalleReserva**; cada uno referencia un **Libro**.

`estado` (Categoría) y `disponible` (Libro) son booleanos de mantenimiento manual.

## Convenciones de modelo

* `jakarta.persistence.*` (nunca `javax`), Lombok `@Data` / `@AllArgsConstructor` /
  `@NoArgsConstructor`, y `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` con el id incluido.
* PK `IDENTITY` en todas las tablas.
* Cada FK `@ManyToOne` declara `@ForeignKey` con nombre en minúsculas
  (`fk_libro_categoria`, `fk_reserva_cliente`, `fk_detalle_reserva`, `fk_detalle_libro`).
* El naming strategy convierte `lowerCamelCase` a `snake_case`.

## SQL de respaldo

`resources/schema-backup.sql` (en la spec compartida `proyecto-base`) contiene el DDL
ejecutable de estas 5 tablas con sus FKs, para crear el esquema a mano.

## Fuera de alcance

DTOs, repositorios, servicios y controladores (ver las specs `crud-*` y `registro-reserva`).

---

# Parte 2 — Notas de implementación

**Fecha** 2026-10-05 · **Status** implementado y verificado contra PostgreSQL 17 (Supabase local).

* El esquema lo genera `ddl-auto: update`; además quedó el DDL en `schema-backup.sql`.
* Verificado: las 5 tablas y las 4 FKs con los nombres declarados.

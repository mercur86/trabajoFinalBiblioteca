# Proyecto Base — arquitectura, stack y guía de replicación del backend

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `biblioteca-backend` |
| **Afecta** | Todo el backend (`pom.xml`, `application.yaml`, `com.biblioteca.*`) |
| **Requisito** | Sistema de Reserva de Libros para una Biblioteca |

> Esta spec es el punto de entrada para **replicar el proyecto**. Las specs de backend
> (`modelo-datos`, `crud-categoria`, `crud-libro`, `crud-cliente`, `busqueda`,
> `validacion-errores`, `postman-testing`) viven en `backend/.agents/features/`, las de
> frontend en `frontend/.agents/features/`, y las compartidas (`registro-reserva`) en
> `.agents/features/`.

---

# Parte 1 — Especificación

## Objetivo

Una API REST con Spring Boot 4.x que gestione **categorías, libros y clientes**, y que
permita **registrar reservas de uno o más libros** por cliente, persistiendo todo en
PostgreSQL. El proyecto sigue un patrón de capas
(`model → dto → repository → service → service.impl → controller`).

## Stack y versiones

| Pieza | Versión | Notas |
| --- | --- | --- |
| Java | **25** | obligatorio (`<java.version>25</java.version>`) |
| Spring Boot | **4.1.1** | `spring-boot-starter-parent` |
| Maven | 3.9.16 | vía Maven Wrapper (`mvnw` / `mvnw.cmd`) |
| PostgreSQL | 17 | Supabase local en `127.0.0.1:54322` (o cualquier Postgres) |
| Lombok | gestionado por el parent | requiere `annotationProcessorPaths` en el compilador |
| ModelMapper | 3.2.6 | mapeo DTO ↔ entidad |
| Spring HATEOAS | gestionado por el parent | endpoints `/hateoas/{id}` |

Dependencias (`pom.xml`): `spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`,
`postgresql` (runtime), `spring-boot-starter-validation`, `spring-hateoas`,
`modelmapper`, `lombok`, `spring-boot-starter-webmvc-test` (test).

> **Spring Security queda fuera** (es opcional). No hay autenticación; el
> CORS se expone para el frontend Angular.

## Estructura de carpetas

```
Biblioteca/
├─ backend/
│  ├─ pom.xml
│  ├─ lombok.config
│  ├─ mvnw · mvnw.cmd · .mvn/wrapper/maven-wrapper.properties
│  └─ src/
│     ├─ main/java/com/biblioteca/
│     │  ├─ BibliotecaBackendApplication.java
│     │  ├─ model/        Categoria, Libro, Cliente, Reserva, DetalleReserva
│     │  ├─ dto/          CategoriaDTO, LibroDTO, ClienteDTO, ReservaDTO, DetalleReservaDTO
│     │  ├─ repository/   IGenericRepo + I<Entidad>Repo
│     │  ├─ service/      ICRUD, I<Entidad>Service
│     │  ├─ service/impl/ CRUDImpl, <Entidad>ServiceImpl
│     │  ├─ controller/   <Entidad>Controller, LanguageController
│     │  ├─ config/       MapperConfig, MessageConfig
│     │  ├─ exception/    CustomErrorTemplate, ModelNotFoundException, ResponseExceptionHandler
│     │  └─ util/         CORS
│     ├─ main/resources/  application.yaml, messages.properties
│     └─ test/java/com/biblioteca/  BibliotecaBackendApplicationTests
├─ postman/               colección + environment (ver spec backend postman-testing)
├─ testdata/              payloads de ejemplo para cargar datos
├─ backend/.agents/       specs, subagentes y workflows de backend
├─ frontend/.agents/      specs, subagente y docs de frontend
└─ .agents/               specs compartidas (proyecto-base, registro-reserva)
```

## Configuración

`src/main/resources/application.yaml`:

```yaml
spring:
  application:
    name: biblioteca-backend
  datasource:
    driver-class-name: org.postgresql.Driver
    url: jdbc:postgresql://127.0.0.1:54322/postgres
    username: postgres
    password: postgres
  jpa:
    database: postgresql
    show-sql: true
    hibernate:
      ddl-auto: update

app:
  front:
    url: ${FRONT_URL:http://localhost:4200}

server:
  port: ${SERVER_PORT:8080}
```

* `ddl-auto: update` crea el esquema al arrancar; no hace falta migration tool.
* Las credenciales son de **desarrollo local** (Supabase local). Para otro entorno,
  cambia `url`/`username`/`password` o externalízalas por variables de entorno.
* `app.front.url` alimenta el filtro CORS.

`lombok.config` (necesario para que `@Qualifier` viaje al constructor):

```
config.stopBubbling = true
lombok.copyableAnnotations += org.springframework.beans.factory.annotation.Qualifier
```

## Convenciones de código (obligatorias para replicar)

* Paquete base `com.biblioteca`. Entidades y campos en **español** (`Categoria.nombre`,
  `Reserva.fechaReserva`).
* `jakarta.persistence.*` (nunca `javax`). Lombok en entidades y DTOs:
  `@Data @AllArgsConstructor @NoArgsConstructor`.
* Entidades: `@EqualsAndHashCode(onlyExplicitlyIncluded = true)` con el id incluido
  (`@EqualsAndHashCode.Include`). PK `GenerationType.IDENTITY`.
* Toda FK `@ManyToOne` declara `@ForeignKey` con **nombre en minúsculas**
  (`fk_libro_categoria`, ...). El naming strategy deriva `snake_case`.
* Interfaz de capa con prefijo `I` (`ILibroService`), implementación `<Nombre>Impl`.
* Inyección por constructor con Lombok `@RequiredArgsConstructor` sobre campos
  `private final` (sin `@Autowired` en campos).
* Controladores devuelven DTOs, fuerzan el id a `null` en create y responden `201` con
  `Location` vía `ServletUriComponentsBuilder`.
* Para referencias a filas existentes se envía **solo el id** (sin `@Valid` en cascada);
  el id nulo se valida en el servicio con `IllegalArgumentException` (→ 400).
* Mensajes de validación configurables viven en `messages.properties` y se referencian
  como `{clave}` en las anotaciones.

## Modelo de datos

```
categoria 1 ──< N libro
cliente   1 ──< N reserva 1 ──< N detalle_reserva N >── 1 libro
```

| Entidad | Tabla | Columnas | FKs |
| --- | --- | --- | --- |
| `Categoria` | `categoria` | id_categoria (identity), nombre(100), descripcion(200), estado(bool) | — |
| `Libro` | `libro` | id_libro (identity), titulo(150), autor(100), isbn(20, unique), disponible(bool), id_categoria | `fk_libro_categoria` |
| `Cliente` | `cliente` | id_cliente (identity), nombres(100), apellidos(100), cedula(15, unique), email(100, unique) | — |
| `Reserva` | `reserva` | id_reserva (identity), fecha_reserva (timestamp), id_cliente | `fk_reserva_cliente`; `@OneToMany` detalles (cascade ALL) |
| `DetalleReserva` | `detalle_reserva` | id_detalle (identity), id_reserva, id_libro | `fk_detalle_reserva`, `fk_detalle_libro` |

El DDL ejecutable está en `resources/schema-backup.sql`.

## API REST

Base: `http://localhost:8080/v1`. Todos los recursos exponen
`GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` y `GET /hateoas/{id}`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET/POST | `/categorias` | Listar / crear categoría |
| GET/PUT/DELETE | `/categorias/{id}` | Obtener / actualizar / eliminar |
| GET/POST | `/libros` | Listar / crear libro |
| GET/PUT/DELETE | `/libros/{id}` | Obtener / actualizar / eliminar |
| GET | `/libros/search/titulo?titulo=` | Buscar por título |
| GET | `/libros/search/autor?autor=` | Buscar por autor |
| GET | `/libros/search/disponible?disponible=` | Filtrar por disponibilidad |
| GET/POST | `/clientes` | Listar / crear cliente |
| GET/PUT/DELETE | `/clientes/{id}` | Obtener / actualizar / eliminar |
| GET/POST | `/reservas` | Listar (fecha, cliente, libros) / registrar reserva |
| GET/PUT/DELETE | `/reservas/{id}` | Obtener / actualizar / eliminar |
| GET | `/reservas/cliente/{idCliente}` | Reservas de un cliente |

## Cómo ejecutar

Requisito: **JDK 25**. Si el `java` por defecto no es 25, apunta `JAVA_HOME`:

```powershell
cd backend
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25.0.4.1+1"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

.\mvnw.cmd -DskipTests package          # compila y empaqueta
.\mvnw.cmd spring-boot:run              # arranca en http://localhost:8080
# o: java -jar target\biblioteca-backend-0.0.1-SNAPSHOT.jar
```

En Linux/macOS usar `./mvnw`.

## Checklist para replicar el proyecto desde cero

1. Crear el proyecto Maven con Spring Boot 4.1.1 y Java 25 (o copiar la estructura).
2. Añadir las dependencias del apartado *Stack* a `pom.xml`.
3. Crear `lombok.config` y la clase `BibliotecaBackendApplication`.
4. Configurar `application.yaml` y `messages.properties`.
5. Implementar `model` (5 entidades) según la tabla de columnas.
6. Implementar `IGenericRepo`, `ICRUD`, `CRUDImpl`.
7. Implementar `dto` con validaciones Jakarta.
8. Implementar repositorios, servicios e impls (CRUD + reglas de Reserva).
9. Implementar controladores (CRUD + HATEOAS + búsquedas + reservas por cliente).
10. Implementar `MapperConfig`, `MessageConfig`, `ResponseExceptionHandler`, `CORS`.
11. Crear la base (`schema-backup.sql` o dejando que `ddl-auto` la genere) y arrancar.
12. Verificar con la colección Postman (`postman/`) y/o los payloads de `testdata/`.

## Criterios de aceptación

* [x] `mvnw -DskipTests package` compila en Java 25.
* [x] El arranque crea las 5 tablas con las FKs nombradas.
* [x] CRUD de Categoría, Libro y Cliente funcionando.
* [x] Registro de reserva con N libros en una transacción.
* [x] Listado de reservas con fecha, cliente y libros.
* [x] Consulta de reservas por cliente.
* [x] Validación `@Valid` y manejo global de excepciones.
* [x] Colección Postman verificada (27 requests / 27 assertions / 0 fallos).

---

# Parte 2 — Notas de implementación

**Fecha** 2026-10-05 · **Status** implementado y verificado contra PostgreSQL 17 (Supabase local).

* El backend usa un patrón de capas clásico (`model → dto → repository → service →
  service.impl → controller`), con las dependencias mínimas (web, JPA, validación, HATEOAS,
  ModelMapper y Lombok).
* `@Valid` **no** se propaga a los DTOs referenciados (`CategoriaDTO` dentro de `LibroDTO`,
  `ClienteDTO` dentro de `ReservaDTO`, `LibroDTO` dentro de `DetalleReservaDTO`): solo se
  envía el id. La ausencia del id se valida en el servicio (400). Esto evita exigir campos
  que el cliente no necesita reenviar.
* El DTO de detalle **no expone** la referencia inversa a `Reserva`; así el JSON no cicla
  y ModelMapper no necesita saltos. El controlador enlaza `detalle.setReserva(entity)` a mano.
* `MapperConfig.defaultMapper` es un único `ModelMapper`; los nombres de campo coinciden
  entre DTO y entidad, por lo que no hacen falta type maps explícitos.

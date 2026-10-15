# Sistema de Reserva de Libros — Biblioteca

Aplicación Full Stack para gestionar la reserva de libros de una biblioteca.

* **Backend:** Spring Boot 4.1.1 · Java 25 · Maven
* **Frontend:** Angular 22 + Angular Material 3 · Node 24
* **Base de datos:** PostgreSQL (Supabase local en `127.0.0.1:54322`)
* **Comunicación:** REST + JSON

> Entregable del *Trabajo Final - Java AI Full Stack* (MitoCode).

## Estructura del repositorio

```
Biblioteca/
├─ backend/                         # API REST Spring Boot (Java 25)
│  ├─ pom.xml · lombok.config · mvnw
│  └─ src/main/java/com/biblioteca/
│     ├─ model/        # Categoria, Libro, Cliente, Reserva, DetalleReserva
│     ├─ dto/          # DTOs con validación Jakarta
│     ├─ repository/   # IGenericRepo + repos por entidad
│     ├─ service/      # ICRUD, interfaces e implementaciones
│     ├─ controller/   # endpoints REST /v1/*
│     ├─ config/       # MapperConfig, MessageConfig
│     ├─ exception/    # manejo global de excepciones
│     └─ util/         # CORS
├─ frontend/                        # SPA Angular 22
│  └─ src/app/
│     ├─ core/         # models, services (@Service) y ui (notificaciones, interceptor)
│     ├─ shared/       # layout (sidebar) y not-found
│     └─ features/     # dashboard, categorias, libros, clientes, reservas
├─ postman/                         # colección + environment (Newman)
├─ testdata/                        # payloads de ejemplo
├─ backend/.agents/                 # specs, subagentes y workflows de backend
├─ frontend/.agents/                # specs, subagente y docs de frontend
├─ .agents/                         # specs COMPARTIDAS + subagentes full-stack
└─ README.md
```

## Funcionalidades implementadas

### Backend

* CRUD de **Categoría**, **Libro** y **Cliente**.
* Registro de **Reserva** con uno o más libros mediante **DetalleReserva** (una sola transacción).
* Listado de reservas mostrando **fecha, cliente y libros reservados**.
* Consulta de las **reservas de un cliente**.
* Validación de requests con `@Valid` y **manejo global de excepciones**.
* Endpoints HATEOAS (`/hateoas/{id}`) en cada recurso.

### Frontend

* Panel con conteos de libros, clientes, categorías y reservas.
* Pantallas de listado, alta, edición y eliminación de **Libros**, **Clientes** y **Categorías**.
* Pantalla de **registro de reserva** seleccionando un cliente y uno o más libros.
* Listado de **reservas** con fecha, cliente y libros, con filtro por cliente.
* Notificaciones (toast) con los errores del backend; rutas cargadas en diferido por feature.

## Modelo de datos

```
categoria 1 ──< N libro
cliente   1 ──< N reserva 1 ──< N detalle_reserva N >── 1 libro
```

| Entidad | Tabla | Relaciones |
| --- | --- | --- |
| Categoria | `categoria` | — |
| Libro | `libro` | FK `fk_libro_categoria` |
| Cliente | `cliente` | — |
| Reserva | `reserva` | FK `fk_reserva_cliente`; `@OneToMany` detalles (cascade ALL) |
| DetalleReserva | `detalle_reserva` | FK `fk_detalle_reserva`, `fk_detalle_libro` |

## Configuración de la base de datos

`backend/src/main/resources/application.yaml`:

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
```

Las tablas se crean solas al arrancar (`ddl-auto: update`). Por defecto apunta al
Postgres de **Supabase local** (puerto `54322`); para otro servidor, cambia la `url`,
`username` y `password`.

## Ejecutar el backend

Requisitos: **JDK 25** y conexión a la base de datos.

```powershell
cd backend

# Apunta JAVA_HOME al JDK 25 (ejemplo en Windows)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25.0.4.1+1"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# Compilar
.\mvnw.cmd -DskipTests package

# Ejecutar (sirve en http://localhost:8080)
.\mvnw.cmd spring-boot:run
# o: java -jar target\biblioteca-backend-0.0.1-SNAPSHOT.jar
```

En Linux/macOS usa `./mvnw`.

## Ejecutar el frontend

Requisitos: **Node 24** y el backend levantado en `http://localhost:8080`
(el backend ya tiene CORS habilitado para `http://localhost:4200`).

```powershell
cd frontend
npm install
npm start            # ng serve -> http://localhost:4200
```

Compilar para producción: `npm run build` (salida en `frontend/dist/`).

## API REST

Base: `http://localhost:8080`

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/v1/categorias` | Lista categorías |
| POST | `/v1/categorias` | Crea categoría |
| PUT | `/v1/categorias/{id}` | Actualiza categoría |
| DELETE | `/v1/categorias/{id}` | Elimina categoría |
| GET | `/v1/libros` | Lista libros (con categoría) |
| POST | `/v1/libros` | Crea libro |
| PUT | `/v1/libros/{id}` | Actualiza libro |
| DELETE | `/v1/libros/{id}` | Elimina libro |
| GET | `/v1/libros/search/titulo?titulo=` | Busca por título |
| GET | `/v1/libros/search?term=` | Busca por título, autor o ISBN (buscador del frontend) |
| GET | `/v1/clientes` | Lista clientes |
| POST | `/v1/clientes` | Crea cliente |
| PUT | `/v1/clientes/{id}` | Actualiza cliente |
| DELETE | `/v1/clientes/{id}` | Elimina cliente |
| GET | `/v1/clientes/search?term=` | Busca por nombre, cédula o email (buscador del frontend) |
| GET | `/v1/reservas` | Lista reservas (fecha, cliente, libros) |
| POST | `/v1/reservas` | Registra reserva con uno o más libros |
| GET | `/v1/reservas/{id}` | Detalle de reserva |
| GET | `/v1/reservas/cliente/{idCliente}` | Reservas de un cliente |

### Ejemplo: registrar una reserva

```http
POST /v1/reservas
Content-Type: application/json

{
  "fechaReserva": "2026-10-05T10:30:00",
  "cliente": { "idCliente": 1 },
  "detalles": [
    { "libro": { "idLibro": 1 } },
    { "libro": { "idLibro": 2 } }
  ]
}
```

## Probar la API con Postman

En `postman/`:

* `Biblioteca-API.postman_collection.json` — 29 requests con tests automáticos.
* `Biblioteca-local.postman_environment.json` — solo define `baseUrl`.

Pasos:

1. Importar la colección y el environment en Postman (o usar Newman).
2. Levantar el backend en `http://localhost:8080`.
3. Ejecutar en orden las carpetas `1 → 2 → 3 → 4`. Los `POST` guardan los ids
   creados en variables (`idCategoria`, `idLibro1`, `idLibro2`, `idCliente`, `idReserva`)
   que reutilizan las llamadas siguientes.
4. La carpeta `5` contiene los casos de error esperados (400/404).

Ejecución por consola con Newman:

```powershell
npx newman run postman\Biblioteca-API.postman_collection.json -e postman\Biblioteca-local.postman_environment.json
```

> La colección genera un `runId` aleatorio por request para respetar los `UNIQUE`
> (isbn, cedula, email), por lo que se puede ejecutar varias veces sin limpiar la base.

## Specs y Agentes de IA

Las specs y agentes están organizados por proyecto:

| Ubicación | Contenido |
| --- | --- |
| `.agents/` | Specs **compartidas / full-stack** y **subagentes** que abarcan ambos proyectos |
| `backend/.agents/` | Specs, subagentes y workflows **de backend** |
| `frontend/.agents/` | Specs, subagente y guía de diseño **de frontend** |

**Specs** (cada una con Parte 1 especificación y Parte 2 implementación):

| Ubicación | Spec | Contenido |
| --- | --- | --- |
| `.agents/` | `proyecto-base` | Arquitectura, stack, configuración, modelo de datos, endpoints y **checklist de replicación**. Incluye `resources/schema-backup.sql`. |
| `.agents/` | `registro-reserva` | Reserva con uno o más libros en una transacción (full-stack). |
| `backend/.agents/` | `modelo-datos` | Entidades JPA, relaciones, convenciones y SQL de respaldo. |
| `backend/.agents/` | `crud-categoria` · `crud-libro` · `crud-cliente` | Un CRUD REST por entidad. |
| `backend/.agents/` | `busqueda` | Búsquedas por término de clientes y libros. |
| `backend/.agents/` | `validacion-errores` | Validación `@Valid` y manejo global de excepciones. |
| `backend/.agents/` | `postman-testing` | Colección Postman/Newman y su verificación. |
| `frontend/.agents/` | `panel`, `crud-categorias`, `crud-libros`, `crud-clientes`, `registro-reserva`, `listado-reservas` | Una spec por pantalla. |

Índices: `.agents/README.md`, `backend/.agents/README.md`, `frontend/.agents/README.md`.

**Agentes**:

* **Compartidos** (`.agents/subagents/`): `fullstack-builder`, `spec-writer`.
* **Backend** (`backend/.agents/subagents/`): `spring-biblioteca-builder`, `spring-api-reviewer`,
  `spring-test-data-generator`.
* **Frontend** (`frontend/.agents/subagents/`): `angular-frontend-builder`.

**Workflow** (`backend/.agents/workflows/`): `generate-full-entity-flow.md`.

**Diseño de frontend** (`frontend/.agents/docs/`): `design.md`.

**Datos de ejemplo** (`testdata/`): payloads para poblar la base por REST.

**Reconstruir el esquema** sin arrancar la app:

```powershell
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f .agents\features\proyecto-base\resources\schema-backup.sql
```

## Estado

Proyecto **completo y verificado**: backend (Spring Boot), frontend (Angular 22),
colección Postman, esquema SQL y specs/agentes de IA.

Mejoras opcionales (fuera del alcance solicitado): autenticación con Spring Security,
Signal Forms en los formularios del frontend, y mapear las violaciones de integridad
de la base a respuestas 409.

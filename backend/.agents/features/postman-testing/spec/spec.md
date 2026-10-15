# Testing de la API con Postman / Newman

| | |
| --- | --- |
| **Status** | Implementado |
| **Fecha** | 2026-10-05 |
| **Alcance** | `postman/` |
| **Afecta** | `Biblioteca-API.postman_collection.json`, `Biblioteca-local.postman_environment.json` |
| **Requisito** | Verificación de los servicios REST del backend |

---

# Parte 1 — Especificación

## Objetivo

Una colección que permita **probar todos los endpoints en orden** (incluyendo el encadenado
de ids) y **verificar automáticamente** los códigos de estado, ejecutable tanto desde la app
de Postman como por consola con Newman.

## Archivos

| Archivo | Rol |
| --- | --- |
| `postman/Biblioteca-API.postman_collection.json` | 29 requests agrupados en 6 carpetas |
| `postman/Biblioteca-local.postman_environment.json` | solo `baseUrl` |

## Variables

Definidas en la colección (el environment **no** debe redefinirlas, o las sombrea por
precedencia de scope):

| Variable | Uso |
| --- | --- |
| `baseUrl` | `http://localhost:8080/v1` |
| `runId` | valor aleatorio por request para respetar columnas `UNIQUE` |
| `idCategoria`, `idLibro1`, `idLibro2`, `idCliente`, `idReserva` | capturadas de los `POST` |

> **Precedencia**: en Postman, `Local > Data > Environment > Collection > Global`. Si el
> environment define las mismas claves que los scripts `pm.collectionVariables.set(...)`,
> esas asignaciones quedan anuladas. Por eso el environment solo lleva `baseUrl`.

## Estructura

```
0. Smoke            GET /categorias
1. Categorias       POST (captura idCategoria) · GET lista · GET id · PUT · HATEOAS
2. Libros           POST x2 (captura idLibro1/2) · GET lista · GET id · PUT · busquedas (incl. /search?term=)
3. Clientes         POST (captura idCliente) · GET lista · GET id · PUT · busqueda (/search?term=)
4. Reservas         POST con 2 libros (captura idReserva) · GET lista · GET id · por cliente
5. Errores (400/404) detalles vacios · libro sin categoria · libro sin id · nombre vacio · 404
```

## Reglas de la colección

* **Captura de ids**: los `POST` leen el header `Location` y guardan el último segmento
  en la variable correspondiente (`loc.split('/').pop()`).
* **Re-ejecutable**: un script a nivel de colección genera
  `runId = Date.now().slice(-6) + random(3)` y los campos únicos usan `{{runId}}`
  (`isbn` → `978-{{runId}}` / `979-{{runId}}`, `cedula` → `{{runId}}`,
  `email` → `cliente{{runId}}@example.com`).
* **Tests**: cada request valida el status esperado (`201`/`200`/`400`/`404`) y, en los
  listados, la forma del JSON.
* Evitar identificadores reservados del sandbox de Postman en los scripts
  (p. ej. `data`); usar `payload`, `body`, etc.

## Uso

App de Postman: importar colección + environment y ejecutar las carpetas `1 → 5` en orden.

Consola (Newman):

```powershell
npx newman run postman\Biblioteca-API.postman_collection.json `
  -e postman\Biblioteca-local.postman_environment.json
```

## Criterios de aceptación

* [x] 29 requests ejecutan sin error de script.
* [x] 29 aserciones pasan (0 fallos) contra el backend levantado.
* [x] Los `POST` encadenan los ids sin intervención manual.
* [x] La colección se puede ejecutar más de una vez sin limpiar la base.
* [x] Los casos de error devuelven `400`/`404` según lo esperado.

---

# Parte 2 — Notas de implementación

**Fecha** 2026-10-05 · **Status** verificado con Newman.

Resultado de la corrida de verificación:

```
requests 29 | test-scripts 26 | assertions 29 | failed 0
```

Dos problemas detectados y corregidos durante la verificación:

1. El environment definía `runId`/ids y **anulaba** las variables de colección; se redujo
   a `baseUrl`.
2. `const data` chocaba con el identificador reservado `data` del sandbox; se renombró a
   `payload`.

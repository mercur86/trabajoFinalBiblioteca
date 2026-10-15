# Generar vertical completa de una entidad

Construir el backend de una o más entidades de la Biblioteca, revisarlo y —solo si la
revisión no arroja hallazgos críticos— poblarlo con datos de prueba a través de los
endpoints REST de creación.

## Agentes asignados

1. `spring-biblioteca-builder` — implementa la vertical (modelo, DTO, repo, servicio,
   implementación, controlador, mapeo).
2. Revisión (humano o `spring-api-reviewer`) — verifica el resultado.
3. Generación de datos de prueba — escribe los JSON en `testdata/<entidad>.json`.

## Entrada requerida

* Objetivo — una entidad (`Libro`), un grupo (`Categoria`, `Libro`) o el paquete completo.
* Spec de referencia en `backend/.agents/features/<feature>/spec/spec.md`
  (las compartidas están en `.agents/features/`).

## Flujo

1. Resuelve el objetivo a una lista concreta de entidades y marca cuáles ya existen.
2. Determina el orden de dependencias (Categoría antes que Libro; Cliente y Libro antes
   que Reserva).
3. Delega en `spring-biblioteca-builder`, una entidad a la vez en ese orden.
4. Confirma que el proyecto compila antes de continuar.
5. Revisa los hallazgos; un hallazgo es crítico si puede causar fallo en tiempo de
   ejecución, pérdida/corrupción de datos o romper el contrato de la API.
6. Si hay hallazgos críticos, devuélvelos al builder y repite; como máximo dos veces.
7. Cuando no queden críticos, escribe `testdata/<entidad>.json` y inserta con
   `curl -X POST {baseUrl}/v1/<ruta>` en orden de dependencias, capturando los ids reales.
8. Confirma `201 Created`/`200 OK` en cada llamada antes de pasar a la siguiente.

## Criterios de aceptación

* La lista de entidades coincide con el objetivo.
* El proyecto compila antes de la revisión.
* No se insertan datos con hallazgos críticos abiertos.
* Los datos se insertan solo por los endpoints REST, nunca por SQL directo.
* El resumen final lista cada id creado.

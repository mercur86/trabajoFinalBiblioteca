# Specs y Agentes de IA — Biblioteca (compartidas)

Las especificaciones y agentes del proyecto se organizan por proyecto:

| Ubicación | Contenido |
| --- | --- |
| **`.agents/`** (aquí, raíz) | Specs **compartidas / full-stack** (afectan backend y frontend). |
| [`backend/.agents/`](../../backend/.agents/README.md) | Specs, subagentes y workflows **de backend**. |
| [`frontend/.agents/`](../../frontend/.agents/README.md) | Specs y subagentes **de frontend** + guía de diseño. |

## Subagentes compartidos (`subagents/`)

Agentes que **abarcan ambos proyectos**:

| Agente | Cubre |
| --- | --- |
| [`fullstack-builder`](subagents/fullstack-builder.md) | Implementa una funcionalidad end-to-end (backend + frontend) desde una spec compartida. |
| [`spec-writer`](subagents/spec-writer.md) | Redacta/actualiza specs en su ubicación correcta (compartida, backend o frontend). |

Los agentes de una sola capa viven en `backend/.agents/subagents/` y `frontend/.agents/subagents/`.

## Specs compartidas

| Spec | Alcance | Contenido |
| --- | --- | --- |
| [`proyecto-base`](features/proyecto-base/spec/spec.md) | Arquitectura / replicación | Stack, estructura, configuración, convenciones, modelo de datos, endpoints y **checklist de replicación**. Incluye [`resources/schema-backup.sql`](features/proyecto-base/resources/schema-backup.sql). |
| [`registro-reserva`](features/registro-reserva/spec/spec.md) | Full-stack (`biblioteca-backend` + `frontend`) | Registrar una reserva con uno o más libros en una transacción; pantalla de registro. |

## Cómo se usan

1. Se escribe la **spec** de la funcionalidad antes de implementarla.
2. El agente correspondiente la implementa: `spring-biblioteca-builder` (backend) o
   `angular-frontend-builder` (frontend).
3. `spring-api-reviewer` revisa; solo los hallazgos críticos bloquean.
4. La verificación final se hace con la colección Postman y con prueba en navegador.

> Si el proyecto crece a varios repositorios, esta carpeta `.agents/` puede extraerse a un
> repo propio de agentes.

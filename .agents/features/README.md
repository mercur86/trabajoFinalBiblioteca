# Specs compartidas — Biblioteca

Solo las especificaciones que afectan a **más de un proyecto** (backend + frontend) o al
proyecto completo.

| Orden | Spec | Alcance |
| --- | --- | --- |
| 1 | [`proyecto-base`](proyecto-base/spec/spec.md) | Arquitectura, stack, configuración, modelo de datos, endpoints y **checklist de replicación**. Recurso: `resources/schema-backup.sql`. |
| 2 | [`registro-reserva`](registro-reserva/spec/spec.md) | Registro de una reserva con uno o más libros (full-stack). |

## Dónde están las demás

* **Backend** (entidades, DTOs, validación, Postman): [`backend/.agents/features/`](../../backend/.agents/features/).
* **Frontend** (pantallas por feature): [`frontend/.agents/features/`](../../frontend/.agents/features/).

## Convención de una spec

Cabecera con `Status`, `Fecha`, `Alcance`, `Afecta`, `Requisito`; **Parte 1** (especificación)
y **Parte 2** (notas de implementación y verificación).

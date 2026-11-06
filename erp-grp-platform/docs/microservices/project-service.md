# `project-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Proyectos, WBS, avance y costos |
| Base de datos | PostgreSQL schema/database `project_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | Escala media |

## APIs
- `POST /api/v1/projects`
- `POST /api/v1/projects/{id}/tasks`
- `GET /api/v1/projects/{id}/costs`

## Eventos publicados
- `ProjectCreated`
- `ProjectStatusChanged`
- `TaskProgressUpdated`

## Eventos consumidos
- `JournalEntryPosted`
- `PurchaseOrderApproved`

## Métricas
- `projects_active`
- `cost_variance`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

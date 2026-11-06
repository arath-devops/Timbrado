# `report-service`

| Campo | Valor |
|-------|-------|
| Capa | core |
| Responsabilidad | Generación de reportes, export y datasets BI |
| Base de datos | PostgreSQL schema/database `report_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Elasticsearch`, `ObjectStorage` |
| Escalabilidad | Workers async HPA memoria; jobs en cola |

## APIs
- `POST /api/v1/reports`
- `GET /api/v1/reports/{id}`
- `GET /api/v1/datasets/{key}`

## Eventos publicados
- `ReportGenerated`
- `ReportFailed`

## Eventos consumidos
- `JournalEntryPosted`
- `BudgetApproved`
- `PayrollClosed`

## Métricas
- `report_render_seconds`
- `report_queue_depth`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

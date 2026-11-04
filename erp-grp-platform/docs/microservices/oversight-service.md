# `oversight-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Auditorías, observaciones y seguimiento |
| Base de datos | PostgreSQL schema/database `oversight_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Elasticsearch` |
| Escalabilidad | Escala media |

## APIs
- `POST /api/v1/audits`
- `POST /api/v1/findings`
- `POST /api/v1/findings/{id}/remediate`

## Eventos publicados
- `AuditOpened`
- `FindingIssued`
- `FindingClosed`

## Eventos consumidos
- `AuditFactRecorded`
- `BudgetModified`

## Métricas
- `open_findings`
- `remediation_aging`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

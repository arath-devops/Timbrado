# `gov-control-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Controles internos, riesgos y cumplimiento |
| Base de datos | PostgreSQL schema/database `gov_control_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | Escala baja-media |

## APIs
- `POST /api/v1/controls`
- `POST /api/v1/risks`
- `GET /api/v1/compliance/status`

## Eventos publicados
- `ControlEvaluated`
- `RiskAssessed`

## Eventos consumidos
- `FindingIssued`
- `AuditFactRecorded`

## Métricas
- `controls_effective_ratio`
- `high_risks_open`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

# `audit-service`

| Campo | Valor |
|-------|-------|
| Capa | core |
| Responsabilidad | Ingesta inmutable de hechos auditables y consulta de trails |
| Base de datos | PostgreSQL schema/database `audit_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Elasticsearch` |
| Escalabilidad | KEDA por lag Kafka; almacenamiento append-only |

## APIs
- `POST /api/v1/facts`
- `GET /api/v1/trails/{entityType}/{entityId}`
- `GET /api/v1/facts/search`

## Eventos publicados
- `AuditFactRecorded`

## Eventos consumidos
- `*.DomainEvent (via audit bridge)`

## Métricas
- `facts_ingested_total`
- `trail_query_latency`
- `hash_chain_failures`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

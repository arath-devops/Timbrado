# `procurement-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Procedimientos de contratación pública |
| Base de datos | PostgreSQL schema/database `procurement_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `ObjectStorage` |
| Escalabilidad | HPA en convocatorias |

## APIs
- `POST /api/v1/procedures`
- `POST /api/v1/bids`
- `POST /api/v1/awards`
- `POST /api/v1/contracts`

## Eventos publicados
- `ProcedurePublished`
- `BidReceived`
- `AwardGranted`
- `PublicContractSigned`

## Eventos consumidos
- `BudgetCommitted`
- `ProcessCompleted`

## Métricas
- `procedures_open`
- `award_amount_sum`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

# `finance-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Centros de costo, periodos, tipos de cambio, control financiero |
| Base de datos | PostgreSQL schema/database `finance_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Redis` |
| Escalabilidad | HPA CPU; lecturas cacheadas |

## APIs
- `POST /api/v1/cost-centers`
- `GET /api/v1/exchange-rates`
- `POST /api/v1/periods/{id}/close`

## Eventos publicados
- `CostCenterCreated`
- `ExchangeRateUpdated`
- `PeriodClosed`

## Eventos consumidos
- `JournalEntryPosted`
- `BudgetApproved`

## Métricas
- `fx_updates`
- `period_close_duration`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

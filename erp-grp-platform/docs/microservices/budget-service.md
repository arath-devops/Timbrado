# `budget-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Ciclo presupuestario, partidas y momentos contables |
| Base de datos | PostgreSQL schema/database `budget_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Redis` |
| Escalabilidad | HPA alta; availability en Redis + PG |

## APIs
- `POST /api/v1/cycles`
- `POST /api/v1/allocations`
- `POST /api/v1/movements/commit`
- `GET /api/v1/availability`

## Eventos publicados
- `BudgetApproved`
- `BudgetCommitted`
- `BudgetAccrued`
- `BudgetPaid`
- `BudgetModified`

## Eventos consumidos
- `PurchaseOrderApproved`
- `PayrollApproved`
- `AwardGranted`
- `InvoiceMatched`
- `PaymentExecuted`

## Métricas
- `availability_checks`
- `commitment_total`
- `budget_overruns_blocked`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

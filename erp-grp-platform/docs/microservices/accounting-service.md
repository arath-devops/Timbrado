# `accounting-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Plan de cuentas, asientos, balanzas, periodos fiscales |
| Base de datos | PostgreSQL schema/database `accounting_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Elasticsearch` |
| Escalabilidad | HPA + CQRS read replicas |

## APIs
- `POST /api/v1/journals`
- `POST /api/v1/journals/{id}/post`
- `GET /api/v1/trial-balance`

## Eventos publicados
- `JournalEntryPosted`
- `JournalEntryReversed`
- `FiscalPeriodClosed`

## Eventos consumidos
- `GoodsReceived`
- `InvoiceMatched`
- `PaymentExecuted`
- `PayrollApproved`
- `BudgetAccrued`

## Métricas
- `journals_posted_total`
- `unbalanced_attempts`
- `posting_latency`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

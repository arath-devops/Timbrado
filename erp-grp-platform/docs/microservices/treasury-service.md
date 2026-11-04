# `treasury-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Cuentas bancarias, pagos, cobros, conciliación |
| Base de datos | PostgreSQL schema/database `treasury_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | HPA; integración bancaria con circuit breaker |

## APIs
- `POST /api/v1/payments`
- `POST /api/v1/collections`
- `POST /api/v1/reconciliations`

## Eventos publicados
- `PaymentOrderCreated`
- `PaymentExecuted`
- `BankReconciled`
- `CollectionRegistered`

## Eventos consumidos
- `InvoiceMatched`
- `PayrollApproved`
- `TaxPaymentReceived`

## Métricas
- `payments_executed_total`
- `reconciliation_match_rate`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

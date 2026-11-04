# `sales-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Cotizaciones, pedidos y facturación comercial |
| Base de datos | PostgreSQL schema/database `sales_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | HPA RPS |

## APIs
- `POST /api/v1/quotes`
- `POST /api/v1/orders`
- `POST /api/v1/invoices`

## Eventos publicados
- `QuoteCreated`
- `SalesOrderConfirmed`
- `InvoiceGenerated`

## Eventos consumidos
- `StockDecreased`
- `PaymentExecuted`

## Métricas
- `orders_total`
- `invoice_amount_sum`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

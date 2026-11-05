# `purchasing-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Requisiciones, OC, recepciones, 3-way match |
| Base de datos | PostgreSQL schema/database `purchasing_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Redis` |
| Escalabilidad | HPA RPS; picos de cierre |

## APIs
- `POST /api/v1/requisitions`
- `POST /api/v1/purchase-orders`
- `POST /api/v1/goods-receipts`
- `POST /api/v1/invoices/match`

## Eventos publicados
- `PurchaseRequisitionCreated`
- `PurchaseOrderCreated`
- `PurchaseOrderApproved`
- `GoodsReceived`
- `InvoiceMatched`

## Eventos consumidos
- `BudgetCommitted`
- `ProcedureAwarded`
- `ProcessCompleted`

## Métricas
- `po_created_total`
- `three_way_match_rate`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

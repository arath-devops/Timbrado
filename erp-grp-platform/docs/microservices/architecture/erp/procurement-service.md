# `procurement-service`
## SA-MS-001 · Capa **ERP (Purchasing/P2P)** · Prioridad: **MVP + F1**

### Responsabilidad
Ciclo Procure-to-Pay operativo: requisiciones, órdenes de compra, recepciones, matching de facturas y cancelaciones, con integración a presupuesto, workflow y documentos.

### Límites (Bounded Context)

**Posee / es dueño de:**
- PurchaseRequisition
- PurchaseOrder
- GoodsReceipt
- SupplierInvoice
- SupplierRef

**No posee / no debe hacer:**
- Saldos de partida (budget-service)
- Expediente binario (document-service)
- Motor de aprobaciones (workflow-service)
- Procedimientos de licitación pública (futuro public-procurement-service)

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/requisitions` | Crear requisición |
| `GET` | `/api/v1/requisitions/{id}` | Detalle |
| `POST` | `/api/v1/requisitions/{id}/submit` | Enviar a aprobación |
| `POST` | `/api/v1/purchase-orders` | Crear OC |
| `POST` | `/api/v1/purchase-orders/{id}/submit` | Submit (dispara budget+WF) |
| `GET` | `/api/v1/purchase-orders/{id}` | Detalle |
| `POST` | `/api/v1/purchase-orders/{id}/cancel` | Cancelar |
| `POST` | `/api/v1/goods-receipts` | Registrar recepción |
| `POST` | `/api/v1/invoices/match` | 3-way/2-way match |

### Eventos publicados
- `PurchaseRequisitionCreated`
- `PurchaseRequisitionSubmitted`
- `PurchaseRequisitionApproved`
- `PurchaseOrderCreated`
- `PurchaseOrderSubmitted`
- `PurchaseOrderApproved`
- `PurchaseOrderRejected`
- `PurchaseOrderCancelled`
- `GoodsReceived`
- `InvoiceMatched`
- `InvoiceMatchFailed`

### Eventos consumidos
- `ProcessCompleted / ProcessRejected`
- `BudgetCommitted`
- `BudgetCommitFailed`
- `BudgetCommitmentReleased`
- `DocumentLinked`
- `CatalogItemDeprecated`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `procurement_db`
- Regla: acceso exclusivo de `procurement-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `workflow-service`
- `budget-service`
- `document-service`
- `catalog-service`
- `audit-service`
- `notification-service`
- `inventory-service (F2 events)`
- `accounting-service (F1 events)`

### Notas de contrato
Al submit/approve: sync CommitBudget (idempotent). No aprobar sin COMMITTED. businessRef hacia workflow/document case file.

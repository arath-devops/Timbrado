# `procurement-service`
## SA-MS-001 · Capa **ERP (Purchasing/P2P)** · Track **ERP-SF-001**

### Responsabilidad
Ciclo Procure-to-Pay operativo comercial: proveedores, requisiciones, órdenes de compra y recepciones.  
Aprobación vía **workflow + umbrales** (ERP-WF-001). **Sin** `budget-service` ([ADR-014](../../../adr/ADR-014-erp-sin-budget-grp.md)).

### Límites (Bounded Context)

**Posee / es dueño de:**
- Vendor (maestro proveedor + banco + holds)
- PurchaseRequisition
- PurchaseOrder
- GoodsReceipt (cabecera/líneas; stock lo confirma inventory)
- SupplierRef / vínculo a catálogo

**No posee / no debe hacer:**
- Partidas / fondos públicos (`budget-service` — **GRP only**)
- Factura CxP y 3-way match motor final (`ap-service`)
- Expediente binario (`document-service`)
- Motor de aprobaciones (`workflow-service`)
- Saldos de inventario (`inventory-service`)

### API (OpenAPI track ERP)

Contrato canónico: [`shared/openapi/erp/procurement/v1.yaml`](../../../../shared/openapi/erp/procurement/v1.yaml)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/vendors` | Alta proveedor |
| `PATCH` | `/api/v1/vendors/{id}` | Actualizar / hold |
| `POST` | `/api/v1/requisitions` | Crear PR |
| `POST` | `/api/v1/requisitions/{id}/submit` | Enviar WF `erp.pr.approve` |
| `POST` | `/api/v1/purchase-orders` | Crear OC |
| `POST` | `/api/v1/purchase-orders/from-pr` | OC desde PR aprobada |
| `POST` | `/api/v1/purchase-orders/{id}/submit` | Enviar WF `erp.po.approve` (**sin** CommitBudget) |
| `POST` | `/api/v1/goods-receipts` | Registrar recepción |
| `GET` | `/api/v1/purchase-orders/{id}` | Detalle + open qty |

### Eventos publicados
Ver [ERP-EV-001](../../../erp/10-EVENTOS-ERP-MVP.md):  
`PurchaseRequisitionSubmitted/Approved`, `PurchaseOrder*`, `GoodsReceiptPosted`.

### Eventos consumidos
- `WorkflowApproved` / `WorkflowRejected` (processKey ERP)
- `DocumentLinked`
- `CatalogItemDeprecated`

### Eventos que NO consume (ERP)
- `BudgetCommitted` / `BudgetReleased` / `BudgetCommitFailed`

### Base de datos
- PostgreSQL · `procurement_db` · Flyway propio
- Campos mínimos: `id`, `tenant_id`, `legal_entity_id`, `document_number`, auditoría, `version`
- **Sin** columnas `allocation_id` / `budget_movement_id`

### Dependencias
- IAM · catalog · workflow · document · audit · Kafka · Postgres
- inventory (eventos GR) · ap (refs PO/GR)
- **No** budget-service

### Notas de contrato
Aprobación OC = WF + umbrales ACME. Account assignment = `costCenterId` / categoría interna, **no** partida CONAC.

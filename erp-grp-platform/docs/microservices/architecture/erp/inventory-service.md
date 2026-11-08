# `inventory-service`
## SA-MS-001 · Capa **ERP** · Track ERP-SF-001

### Responsabilidad
Artículos, almacenes, existencias (on_hand / reserved / available ATP), movimientos y confirmación de recepciones/entregas.

### Posee
Item, Warehouse, Bin, StockBalance, StockMovement, Delivery (operativa)

### No posee
OC/PR (procurement) · asientos (accounting) · facturas (ap/ar)

### OpenAPI
[`shared/openapi/erp/inventory/v1.yaml`](../../../../shared/openapi/erp/inventory/v1.yaml)

### Eventos
Publica: `GoodsReceiptPosted` (si dueño físico), `DeliveryPosted`, `ItemCreated/Updated`  
Consume: `PurchaseOrderApproved` (reserva opcional), `SalesOrderConfirmed`

### BD
`inventory_db` · sin tablas GRP

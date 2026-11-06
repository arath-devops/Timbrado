# Compras

**Microservicio:** `purchasing-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Crear requisición
- Aprobar OC
- Recibir mercancía
- Cuadrar factura 3-way match

## Agregados y Entidades

### Agregado `PurchaseRequisition`
- **Descripción:** Requisición
- **Atributos clave:** requester, lines, status

### Agregado `PurchaseOrder`
- **Descripción:** Orden de compra
- **Atributos clave:** supplier, lines, total, status

### Agregado `GoodsReceipt`
- **Descripción:** Recepción
- **Atributos clave:** poId, lines, receivedAt

### Agregado `SupplierInvoice`
- **Descripción:** Factura proveedor
- **Atributos clave:** poId, amount, matchStatus


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `PurchaseRequisitionCreated`
- `PurchaseOrderCreated`
- `PurchaseOrderApproved`
- `GoodsReceived`
- `InvoiceMatched`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

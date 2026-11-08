# `ar-billing-service`
## SA-MS-001 · Capa **ERP · AR + Billing (O2C light)** · Track ERP-SF-001

### Responsabilidad
Clientes, límite/hold de crédito, pedidos de venta, facturas cliente, cobros, puerto CFDI (adaptador).

### Posee
Customer, CreditProfile, SalesOrder, CustomerInvoice, CustomerPayment, FiscalDocumentRef

### No posee
Inventario físico (inventory) · GL postings owner (accounting consume eventos)

### OpenAPI
[`shared/openapi/erp/ar-billing/v1.yaml`](../../../../shared/openapi/erp/ar-billing/v1.yaml)

### Eventos
`CustomerCreditChecked`, `SalesOrderConfirmed`, `CustomerInvoiceIssued`, `CustomerPaymentApplied`, `CreditHold*`

### BD
`ar_db`

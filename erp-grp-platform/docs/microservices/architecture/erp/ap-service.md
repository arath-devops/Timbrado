# `ap-service`
## SA-MS-001 · Capa **ERP · Accounts Payable** · Track ERP-SF-001

### Responsabilidad
Facturas de proveedor, motor 2/3-way match, retenciones MX, `payment_block`, propuestas de pago (maker).

### Posee
VendorInvoice, MatchResult, PaymentProposal (draft)

### No posee
Ejecución bancaria (treasury) · maestros vendor write primario (procurement) · budget GRP

### OpenAPI
[`shared/openapi/erp/ap/v1.yaml`](../../../../shared/openapi/erp/ap/v1.yaml)

### Eventos
`VendorInvoiceReceived`, `ThreeWayMatchCompleted`, `VendorInvoiceApproved/Blocked`, `PaymentProposalCreated`

### BD
`ap_db`

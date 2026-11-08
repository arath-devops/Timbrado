# `treasury-service`
## SA-MS-001 · Capa **ERP · Treasury** · Track ERP-SF-001

### Responsabilidad
Cuentas bancarias, posición de efectivo, ejecución de pagos (checker), extractos, conciliación.

### Posee
BankAccount, PaymentOrder, BankStatement, Reconciliation

### No posee
Propuesta CxP maker (`ap-service`) · asientos (accounting vía eventos)

### OpenAPI
[`shared/openapi/erp/treasury/v1.yaml`](../../../../shared/openapi/erp/treasury/v1.yaml)

### Eventos
`PaymentExecuted`, `BankStatementImported`, `BankReconciliationCompleted`  
Consume `PaymentProposalApproved`

### SoD
Preparador propuesta ≠ ejecutor/aprobador pago (ERP-SOD-001)

### BD
`treasury_db`

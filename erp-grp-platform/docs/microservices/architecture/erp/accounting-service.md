# `accounting-service`
## SA-MS-001 · Capa **ERP · Financials / GL** · Track ERP-SF-001

### Responsabilidad
Plan de cuentas, periodos, asientos (park/post), saldos, mayor, balanza, EEFF básicos.

### Posee
ChartOfAccounts, FiscalPeriod, JournalEntry, AccountBalance

### No posee
Bancos operativos (treasury) · facturas operativas (ap/ar)

### OpenAPI
[`shared/openapi/erp/accounting/v1.yaml`](../../../../shared/openapi/erp/accounting/v1.yaml)

### Eventos
`JournalEntryPosted`, `PeriodClosed`, `PeriodReopened`  
Consume postings desde ap / ar / treasury / inventory

### BD
`accounting_db`

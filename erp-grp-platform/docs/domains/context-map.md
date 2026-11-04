# Context Map ERP+GRP

```mermaid
flowchart LR
  IAM[[IAM OHS]]
  CAT[[Catalog OHS]]
  WF[[Workflow]]
  AUD[[Audit]]

  PUR[Purchasing]
  ACC[Accounting]
  BUD[Budget]
  INV[Inventory]
  PAY[Payroll]
  PRC[Public Procurement]
  TRE[Treasury]
  TAX[Tax]
  CIT[Citizen]
  DOC[Document]

  IAM -.-> PUR & ACC & BUD & PAY & PRC & CIT
  CAT -.-> PUR & ACC & BUD
  WF --> PUR & BUD & PAY & PRC
  PUR -->|Customer/Supplier| ACC
  PUR -->|Customer/Supplier| BUD
  PUR -->|Customer/Supplier| INV
  PRC -->|ACL| PUR
  PRC -->|Customer/Supplier| BUD
  PAY -->|Customer/Supplier| ACC
  PAY -->|Customer/Supplier| BUD
  TAX -->|Customer/Supplier| TRE
  TRE --> ACC
  CIT --> DOC
  ACC --> AUD
  BUD --> AUD
```

## Dependencias críticas (acyclic rule)

Los contextos de **Core** no dependen de ERP/GRP.  
ERP no depende de GRP excepto vía **ACL** en adaptadores de integración.  
GRP puede consumir eventos ERP (Conformist) pero traduce con ACL.

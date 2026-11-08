# OpenAPI track ERP

Contratos canónicos del producto **ERP** (ERP-SF-001 · ADR-014).

| Servicio | Spec |
|----------|------|
| procurement-service | [procurement/v1.yaml](procurement/v1.yaml) |
| inventory-service | [inventory/v1.yaml](inventory/v1.yaml) |
| ap-service | [ap/v1.yaml](ap/v1.yaml) |
| ar-billing-service | [ar-billing/v1.yaml](ar-billing/v1.yaml) |
| accounting-service | [accounting/v1.yaml](accounting/v1.yaml) |
| treasury-service | [treasury/v1.yaml](treasury/v1.yaml) |

Componentes compartidos: [`../common/v1.yaml`](../common/v1.yaml) (`LegalEntityIdHeader`, Money, errores).

**No usar** `../procurement/v1.yaml` ni `../budget/v1.yaml` para el track ERP: el primero está acoplado a GRP; el segundo es solo GRP.

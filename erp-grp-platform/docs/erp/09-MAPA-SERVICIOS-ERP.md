# Mapa de servicios ERP (release-1)
## ERP-MS-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-MS-001 |
| Congelamiento | ERP-SF-001 |
| ADR | [ADR-014](../adr/ADR-014-erp-sin-budget-grp.md) |
| Estado | **Congelado para desarrollo ERP** |

---

## 1. Servicios DENTRO (track ERP)

| Servicio | BD | Dueño de dominio | OpenAPI |
|----------|-----|------------------|---------|
| `iam-service` | `iam_db` | Identidad, roles Freeze, scopes LE/OU | `shared/openapi/iam` |
| `catalog-service` | `catalog_db` | Catálogos, series folio, umbrales, tax | `shared/openapi/catalog` (+ seeds ERP) |
| `workflow-service` | `workflow_db` | 6 procesos ERP-WF | `shared/openapi/workflow` |
| `document-service` | `document_db` | Expedientes | `shared/openapi/document` |
| `audit-service` | `audit_db` | Rastro | `shared/openapi/audit` |
| `procurement-service` | `procurement_db` | Proveedor, PR, OC, GR (**sin budget**) | `shared/openapi/erp/procurement` |
| `inventory-service` | `inventory_db` | Artículos, ATP, movimientos | `shared/openapi/erp/inventory` |
| `ap-service` | `ap_db` | Facturas CxP, match, propuesta pago | `shared/openapi/erp/ap` |
| `ar-billing-service` | `ar_db` | Clientes crédito, SO link, AR, CFDI port | `shared/openapi/erp/ar-billing` |
| `accounting-service` | `accounting_db` | COA, periodos, asientos, saldos | `shared/openapi/erp/accounting` |
| `treasury-service` | `treasury_db` | Bancos, pagos dual, conciliación | `shared/openapi/erp/treasury` |

## 2. Servicios FUERA del track ERP

| Servicio | Motivo |
|----------|--------|
| `budget-service` | GRP — ADR-014 |
| `payroll-service` | OUT Freeze release-1 |
| Ciudadano / tax / social / transparency | GRP |

## 3. Dependencias permitidas (ERP)

```text
iam, catalog, workflow, document, audit
        │
        ├── procurement ──► inventory (GoodsReceived)
        │         └──► ap (PO/GR refs)
        ├── inventory ◄── ar-billing (Delivery)
        ├── ap ──► treasury (PaymentProposal)
        ├── ar-billing ──► treasury (Receipts/deposits)
        ├── accounting ◄── ap / ar / treasury / inventory (postings)
        └── treasury ──► accounting (payments cleared)
```

**Prohibido:** flecha hacia `budget-service` desde cualquier servicio ERP.

## 4. Claims JWT / módulos menú ERP

```json
"modules": [
  "core.iam", "core.catalog", "core.workflow", "core.document", "core.audit",
  "erp.procurement", "erp.inventory", "erp.ap", "erp.ar", "erp.billing",
  "erp.accounting", "erp.treasury"
]
```

Sin `grp.*` en clientes del producto ERP.

## 5. Dueños técnicos (asignar nombres reales)

| Servicio | Dueño técnico | Fecha |
|----------|---------------|-------|
| iam / catalog / workflow / document / audit | _asignar_ | |
| procurement | _asignar_ | |
| inventory | _asignar_ | |
| ap | _asignar_ | |
| ar-billing | _asignar_ | |
| accounting | _asignar_ | |
| treasury | _asignar_ | |

---

**Fin ERP-MS-001**

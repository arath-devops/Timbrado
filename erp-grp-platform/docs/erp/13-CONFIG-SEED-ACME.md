# Config seed tenant ACME (ERP)
## ERP-CFG-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-CFG-001 |
| Tenant demo | `ACME` |
| Moneda | MXN |
| País | MX |
| Estado | **Obligatorio para ambiente de desarrollo ERP** |

---

## 1. Organización

```yaml
tenant: ACME
legalEntities:
  - id: le-acme-mx
    name: ACME México SA de CV
    rfc: ACM010101AAA
    currency: MXN
orgUnits:
  - { id: ou-compras, name: Compras, legalEntityId: le-acme-mx }
  - { id: ou-almacen, name: Almacén, legalEntityId: le-acme-mx }
  - { id: ou-finanzas, name: Finanzas, legalEntityId: le-acme-mx }
  - { id: ou-ventas, name: Ventas, legalEntityId: le-acme-mx }
costCenters:
  - { id: cc-100, code: "100", name: Administración }
  - { id: cc-200, code: "200", name: Operaciones }
  - { id: cc-300, code: "300", name: Comercial }
```

## 2. Plan de cuentas (mínimo)

| Cuenta | Nombre | Tipo |
|--------|--------|------|
| 1100 | Bancos | Asset |
| 1200 | Clientes | Asset |
| 1300 | Inventarios | Asset |
| 1400 | IVA acreditable | Asset |
| 2100 | Proveedores | Liability |
| 2200 | IVA por pagar | Liability |
| 3100 | Capital | Equity |
| 4100 | Ingresos ventas | Revenue |
| 5100 | Costo de ventas | Expense |
| 5200 | Gastos operación | Expense |

Periodo abierto: `2026-11` (y mes corriente del ambiente).

## 3. Series de folio

| Serie | Objeto | Formato |
|-------|--------|---------|
| PR | Requisición | `PR-{YYYY}-{####}` |
| PO | Orden compra | `PO-{YYYY}-{####}` |
| GR | Recepción | `GR-{YYYY}-{####}` |
| VI | Factura proveedor | `VI-{YYYY}-{####}` |
| SO | Pedido venta | `SO-{YYYY}-{####}` |
| CI | Factura cliente | `CI-{YYYY}-{####}` |
| JE | Asiento | `JE-{YYYY}-{####}` |
| PY | Pago | `PY-{YYYY}-{####}` |

## 4. Umbrales workflow (MXN)

| Clave | Valor |
|-------|------:|
| `pr.auto_approve_max` | 5000 |
| `pr_purchasing_review` | 25000 |
| `po_manager` | 50000 |
| `po_finance` | 200000 |
| `ap.match.price_tol_pct` | 2 |
| `ap.match.qty_tol_pct` | 0 |
| `ar.credit.default_limit` | 100000 |

## 5. Impuestos

| Código | Tasa | Cuenta |
|--------|------|--------|
| IVA16 | 16% | 1400 / 2200 |
| IVA0 | 0% | — |
| EXENTO | — | — |

## 6. Usuarios demo (SoD)

| Usuario | Roles Freeze | OU |
|---------|--------------|-----|
| `solicitante.acme` | ROLE_REQUESTOR | ou-compras |
| `compras.acme` | ROLE_PURCHASING | ou-compras |
| `almacen.acme` | ROLE_WAREHOUSE | ou-almacen |
| `ap.acme` | ROLE_AP | ou-finanzas |
| `ar.acme` | ROLE_AR | ou-ventas |
| `credito.acme` | ROLE_CREDIT | ou-finanzas |
| `tesoreria.acme` | ROLE_TREASURY | ou-finanzas |
| `contador.acme` | ROLE_ACCOUNTANT | ou-finanzas |
| `controller.acme` | ROLE_FINANCE_CONTROLLER | ou-finanzas |
| `maestro.acme` | ROLE_MASTER_DATA | ou-finanzas |
| `admin.acme` | ROLE_ADMIN (break-glass) | — |

Password solo en secret manager / `.env.local` — **nunca** en git.

## 7. Maestros mínimos

- 3 proveedores (nacional, extranjero, servicios)
- 3 clientes con límite de crédito
- 10 artículos (stock + servicio)
- 1 almacén `WH-MAIN`, 1 ubicación `BIN-01`
- 1 cuenta bancaria `BANAMEX-****1234` en 1100

## 8. Qué NO se siembra

- Partidas presupuestales CONAC / `allocationId`
- Catálogos solo-GRP (dependencias, programas)

---

**Fin ERP-CFG-001**

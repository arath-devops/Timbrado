# Definiciones workflow ERP MVP (6 procesos)
## ERP-WF-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-WF-001 |
| Motor | `workflow-service` |
| Estado | **Listo para seed en catalog/workflow** |

Cada definición: `processKey`, disparador, pasos, umbrales, roles Freeze, resultado.

---

## WF-01 — Aprobación requisición (PR)

| Campo | Valor |
|-------|--------|
| processKey | `erp.pr.approve` |
| Disparador | `PurchaseRequisitionSubmitted` |
| Roles | Solicitante → Jefe área → (opcional) Compras |
| Umbral | Monto estimado &gt; `pr.auto_approve_max` → 2 pasos; si no, 1 paso jefe |
| Resultado | PR `APPROVED` / `REJECTED` |

```yaml
processKey: erp.pr.approve
steps:
  - key: area_manager
    role: ROLE_AREA_MANAGER
    action: APPROVE|REJECT
  - key: purchasing
    role: ROLE_PURCHASING
    when: amount > threshold.pr_purchasing_review
    action: APPROVE|REJECT
```

---

## WF-02 — Aprobación orden de compra (OC)

| Campo | Valor |
|-------|--------|
| processKey | `erp.po.approve` |
| Disparador | `PurchaseOrderSubmitted` |
| Roles | Compras → Gerente → (opcional) Finanzas si monto alto |
| **NO** | CommitBudget / allocation |
| Resultado | PO `APPROVED` / `REJECTED` |

```yaml
processKey: erp.po.approve
steps:
  - key: purchasing_lead
    role: ROLE_PURCHASING
    action: APPROVE|REJECT
  - key: manager
    role: ROLE_AREA_MANAGER
    when: amount > threshold.po_manager
    action: APPROVE|REJECT
  - key: finance
    role: ROLE_FINANCE_CONTROLLER
    when: amount > threshold.po_finance
    action: APPROVE|REJECT
```

Umbrales seed ACME (MXN): `po_manager=50000`, `po_finance=200000`.

---

## WF-03 — Excepción 3-way match

| Campo | Valor |
|-------|--------|
| processKey | `erp.ap.match_exception` |
| Disparador | Match ≠ matched (precio/qty/cuenta fuera de tolerancia) |
| Roles | ROLE_AP → ROLE_FINANCE_CONTROLLER |
| Resultado | `FORCE_MATCH` / `BLOCK` / `RETURN_TO_VENDOR` |

---

## WF-04 — Dual control pago a proveedor

| Campo | Valor |
|-------|--------|
| processKey | `erp.ap.payment_dual` |
| Disparador | `PaymentProposalCreated` |
| Roles | ROLE_TREASURY (prepara) ≠ ROLE_FINANCE_CONTROLLER o segundo tesorero (aprueba) |
| SoD | Preparador ≠ aprobador (mismo userId prohibido) |
| Resultado | `PaymentProposalApproved` → treasury ejecuta |

---

## WF-05 — Crédito / hold cliente

| Campo | Valor |
|-------|--------|
| processKey | `erp.ar.credit_exception` |
| Disparador | ATP/crédito falla o SO sobre límite |
| Roles | ROLE_AR / ROLE_CREDIT → override ROLE_FINANCE_CONTROLLER |
| Resultado | Hold / Release / Override con motivo |

---

## WF-06 — Cierre / reapertura periodo contable

| Campo | Valor |
|-------|--------|
| processKey | `erp.gl.period_close` |
| Disparador | Solicitud cierre o reopen |
| Roles | ROLE_ACCOUNTANT propone → ROLE_FINANCE_CONTROLLER aprueba |
| SoD | Quien cierra no reapertura solo; reopen exige segundo aprobador |
| Resultado | `PeriodClosed` / `PeriodReopened` |

---

## Registro en workflow-service

Al arrancar entorno ACME, seed:

```json
{
  "definitions": [
    "erp.pr.approve",
    "erp.po.approve",
    "erp.ap.match_exception",
    "erp.ap.payment_dual",
    "erp.ar.credit_exception",
    "erp.gl.period_close"
  ]
}
```

Detalle JSON de definición vive en `workflow-service` (`classpath:workflows/erp/*.json`) — este doc es la especificación contractual.

---

**Fin ERP-WF-001**

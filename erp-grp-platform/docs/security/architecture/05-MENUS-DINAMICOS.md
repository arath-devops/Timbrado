# 5. Menús dinámicos
## SEC-ARCH-001

## 5.1 Fórmula de resolución

```text
menuVisible =
    menu.module ∈ tenant.modules
AND menu.module ∈ user.modules
AND (menu.permission is null OR user.has(menu.permission))
AND user.orgScopes is not empty for menu.scopeRequirement
AND ABAC menu policies allow
```

Endpoint lógico: `GET /api/v1/me/menus` (IAM o BFF).

## 5.2 Modelo de menú

| Campo | Descripción |
|-------|-------------|
| `code` | Identificador estable |
| `parentCode` | Árbol |
| `label` i18n | es-MX / en-US |
| `route` | Angular path / MFE remote |
| `module` | `erp.purchasing`, `grp.budget`… |
| `permission` | permiso mínimo |
| `scopeRequirement` | `ANY`, `OU`, `LEGAL_ENTITY`, `TENANT_ADMIN` |
| `order` | ordenamiento |
| `icon` | opcional |

## 5.3 Árbol MVP municipal

```yaml
menus:
  - code: HOME
    route: /
  - code: TASKS
    label: { es-MX: "Mis aprobaciones" }
    route: /workflow/inbox
    permission: workflow.task:read
  - code: ERP
    module: erp
    children:
      - code: PUR
        module: erp.purchasing
        permission: purchasing.requisition:read
        route: /erp/purchasing
        children:
          - code: PUR_REQ
            permission: purchasing.requisition:create
            route: /erp/purchasing/requisitions
          - code: PUR_PO
            permission: purchasing.po:read
            route: /erp/purchasing/orders
      - code: DOC
        module: core.document
        permission: document.file:read
        route: /docs
  - code: GRP
    module: grp
    children:
      - code: BUD
        module: grp.budget
        permission: budget.allocation:read
        route: /grp/budget
        children:
          - code: BUD_AVAIL
            permission: budget.availability:read
            route: /grp/budget/availability
          - code: BUD_ALLOC
            permission: budget.allocation:read
            route: /grp/budget/allocations
  - code: ADMIN
    scopeRequirement: TENANT_ADMIN
    permission: iam.user:read
    children:
      - code: ADMIN_USERS
        permission: iam.user:read
      - code: ADMIN_ORG
        permission: org.unit:read
      - code: ADMIN_CAT
        permission: catalog.item:write
      - code: ADMIN_AUDIT
        permission: audit.fact:read
```

## 5.4 Menús ERP / GRP futuros (activables)

| Menú | Módulo | Fuera F1? |
|------|--------|-----------|
| Contabilidad | erp.accounting | Parcial F1 |
| Tesorería | erp.treasury | Parcial F1 |
| Inventarios | erp.inventory | F2+ |
| RRHH | erp.hr | F2+ |
| Nómina | erp.payroll | OUT-F1 |
| Contrataciones | grp.procurement | F2+ |
| Transparencia | grp.transparency | F2+ |
| Ciudadanía | grp.citizen | OUT-F1 |
| Recaudación | grp.tax | OUT-F1 |
| Programas | grp.social | OUT-F1 |

## 5.5 Justificación

Menú dinámico evita hardcode por rol nominativo y soporta módulos on/off por tenant (Dynamics app launcher / SAP Fiori groups pattern).

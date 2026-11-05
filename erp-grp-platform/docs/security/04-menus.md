# Modelo de Menús

Los menús se resuelven en runtime:

```
menu = f(roles ∩ permissions ∩ tenant.modules ∩ locale)
```

## Estructura
```yaml
menus:
  - code: ERP_ROOT
    label: { es-MX: "ERP", en-US: "ERP" }
    module: erp
    children:
      - code: FINANCE
        route: /erp/finance
        permission: finance:access
        module: erp.finance
      - code: ACCOUNTING
        route: /erp/accounting
        permission: accounting:access
        module: erp.accounting
  - code: GRP_ROOT
    label: { es-MX: "GRP", en-US: "Public Sector" }
    module: grp
    children:
      - code: BUDGET
        route: /grp/budget
        permission: budget:access
        module: grp.budget
      - code: CITIZEN
        route: /grp/citizen
        permission: citizen:access
        module: grp.citizen
  - code: ADMIN
    permission: admin:access
    children:
      - code: USERS
        route: /admin/users
        permission: user:read
```

Angular Shell consume `GET /api/v1/me/menus`.

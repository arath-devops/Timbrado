# ERP Preview Kit (HTML / CSS / JS)

Demo visual del ERP definida en **ERP-SI-001** + **ERP-FM-001**.  
Sin Angular · sin backend · sin pantallas/campos inventados.

## Arranque

```bash
cd erp-grp-platform/erp-preview
python3 -m http.server 4174 --bind 127.0.0.1
# http://127.0.0.1:4174/
```

En el login elige **empresa + rol** (DG, CFO, Contador, Comprador, Vendedor, Almacén, RRHH). Cualquier password.

### P0 UX (ERP-UX-001)

- Labels en español (+ hint técnico)
- Switcher de empresa y rol (menú filtrado)
- Grid de líneas + totales calculados
- Object pages con tabs (Datos / Líneas / WF / Docs / Audit)
- Match 3-way en CxP
- OC desde PR + open qty
- Crédito en pedidos / clientes
- ATP en existencias + recepción en Inventarios
- Dashboard por rol

### Portable (1 archivo)

**No uses** `raw.githubusercontent.com` ni `htmlpreview.github.io`.

https://raw.githack.com/arath-devops/Timbrado/feat-ERP/erp-grp-platform/erp-preview/portable.html


## Estructura

```text
erp-preview/
  index.html                 # Login (tenant_or_company, username, password)
  dashboard/                 # Home ejecutivo
  finanzas/                  # GL, AP, AR, Billing, Tesorería
  compras/                   # PR, OC, Recepción, Proveedores
  ventas/                    # Pedidos, Entregas
  inventarios/               # Artículos, Existencias, Movimientos
  rh/                        # Empleados, Ausencias
  nomina/                    # Corrida, Dispersión
  activos/                   # Alta, Depreciación
  proyectos/                 # Lista, Timesheets
  administracion/            # IAM, Org, Catálogos, Bandeja, Docs, Perfil, Audit
  reportes/                  # Reportes estándar MVP
  assets/css|js
```

## UX

Sidebar + Navbar + Breadcrumbs + Notificaciones + Perfil + Tema claro/oscuro.  
Inspiración: SAP Fiori · Oracle Fusion · NetSuite · Odoo Enterprise.

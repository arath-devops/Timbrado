# ERP Preview Kit (HTML / CSS / JS)

Demo visual del ERP definida en **ERP-SI-001** + **ERP-FM-001**.  
Sin Angular · sin backend · sin pantallas/campos inventados.

## Arranque

```bash
cd erp-grp-platform/erp-preview
python3 -m http.server 4174 --bind 127.0.0.1
# http://127.0.0.1:4174/
```

Login demo: `mhernandez` / cualquier password → Dashboard.

### Portable (1 archivo)

Abre `portable.html` directo en el navegador (doble clic) o descarga desde la rama `feat-ERP`.  
Incluye sidebar, módulos y datos ACME en un solo HTML sin servidor.

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

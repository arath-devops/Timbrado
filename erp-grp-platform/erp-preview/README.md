# Kit de preview ERP (HTML / CSS / JS)

Demo visual del ERP según **ERP-SI-001** + **ERP-FM-001** + mejoras P0 de **ERP-UX-001**.  
Sin Angular · sin backend · sin pantallas ni campos inventados.

Documentación de producto (español): [`../docs/erp/`](../docs/erp/) · Glosario [`../docs/erp/07-GLOSARIO-ERP-DESARROLLO.md`](../docs/erp/07-GLOSARIO-ERP-DESARROLLO.md)

## Arranque

```bash
cd erp-grp-platform/erp-preview
python3 -m http.server 4174 --bind 127.0.0.1
# http://127.0.0.1:4174/
```

En el inicio de sesión elige **empresa + rol** (Director General, CFO, Contador, Comprador, Vendedor, Almacén, RRHH). Cualquier contraseña.

### Mejoras P0 de experiencia

- Etiquetas en español (+ pista técnica del campo)
- Selector de empresa y rol (menú filtrado)
- Tabla de líneas + totales calculados
- Fichas con pestañas (Datos / Líneas / Flujo / Documentos / Auditoría)
- Cuadre triple en CxP
- Crear OC desde requisición + cantidad abierta
- Crédito en pedidos / clientes
- Existencias disponibles (ATP) + recepción en Inventarios
- Tablero según rol

### Archivo portable (uno solo)

**No uses** `raw.githubusercontent.com` ni `htmlpreview.github.io` (muestran código o rompen la navegación).

https://raw.githack.com/arath-devops/Timbrado/feat-ERP/erp-grp-platform/erp-preview/portable.html

## Estructura

```text
erp-preview/
  index.html                 # Inicio de sesión
  dashboard/                 # Inicio ejecutivo
  finanzas/                  # Contabilidad, CxP, CxC, Facturación, Tesorería
  compras/                   # Requisiciones, OC, Recepción, Proveedores
  ventas/                    # Pedidos, Entregas
  inventarios/               # Artículos, Existencias, Movimientos, Recepción
  rh/                        # Empleados, Ausencias
  nomina/                    # Corrida, Dispersión (stub Profesional)
  activos/                   # Alta, Depreciación (stub)
  proyectos/                 # Lista, Timesheets (stub)
  administracion/            # Usuarios, Org, Catálogos, Bandeja, Docs, Perfil, Auditoría
  reportes/                  # Reportes estándar MVP
  assets/css|js
```

## Experiencia

Barra lateral + barra superior + migas de pan + notificaciones + perfil + tema claro/oscuro.  
Inspiración visual: SAP Fiori · Oracle Fusion · NetSuite · Odoo Enterprise.

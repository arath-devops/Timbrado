# Inventario de pantallas ERP
## ERP-SI-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-SI-001 |
| Título | Inventario funcional de pantallas ERP |
| Tipo | Inventario de producto / UX (sin interfaz implementada) |
| Estado | Borrador de alineación — `feat-ERP` |
| Idioma | Español (prioridad MVP/Profesional/Empresarial; códigos de rol en inglés) |
| Referentes | SAP S/4HANA (Fiori) · Oracle Fusion Cloud ERP · Microsoft Dynamics 365 F&SCM · NetSuite · Infor CloudSuite · Odoo Enterprise |
| Arquitectura | DDD-PORT-001 · SA-MS-001 |
| Alcance | **Solo ERP** (capa privada + dominios compartidos usados por empresa). No incluye pantallas exclusivas GRP (presupuesto público CONAC, obra pública, transparencia, ciudadano, etc.) |
| Glosario | [ERP-GL-001](07-GLOSARIO-ERP-DESARROLLO.md) |

---

## 0. Cómo leer este inventario

### 0.1 Niveles de producto

| Nivel | Significado |
|-------|-------------|
| **MVP** | Mínimo para operar compras-a-pago + pedido-a-cobro ligero + finanzas básicas en PyME/empresa mediana |
| **Profesional** (`Professional`) | Operación completa de finanzas, compras, inventario, ventas y RRHH sin manufactura avanzada |
| **Empresarial** (`Enterprise`) | Suite completa: manufactura, almacén avanzado, transporte, controlling profundo, multi-compañía, GRC, autoservicio masivo |

### 0.2 Columnas

| Columna | Descripción |
|--------|-------------|
| Pantalla | Nombre funcional (no ruta técnica) |
| Objetivo | Para qué existe |
| Usuario | Rol primario |
| Prioridad | MVP / Professional / Enterprise |

### 0.3 Tipos de usuario (roles canónicos)

| Código | Rol |
|--------|-----|
| EMP | Empleado / solicitante |
| BUY | Comprador |
| APPR | Aprobador / manager |
| AP | Contador CxP |
| AR | Contador CxC |
| GL | Contador general |
| TRE | Tesorero |
| INV | Almacenista / inventory clerk |
| SAL | Vendedor / order desk |
| CRM | Sales rep / account manager |
| MFG | Planner / production supervisor |
| HR | RRHH |
| PAY | Nómina |
| PM | Project manager |
| ADM | Admin de sistema / master data |
| CFO | Director financiero (solo lectura ejecutiva) |
| AUD | Auditor interno |

### 0.4 Convenciones de mapeo a mercado

| Nuestra pantalla | Análogos típicos |
|------------------|------------------|
| Bandeja de aprobación | Fiori My Inbox · D365 Work items · Fusion Approvals · Odoo Approvals |
| Facturas proveedor | F0859 Manage Supplier Invoices · Fusion Payables · D365 Vendor invoices · NetSuite Bill |
| Pedidos de venta | Fiori Manage Sales Orders · Fusion OM · D365 Sales orders · Odoo Sales |
| Requisiciones | F1643 Create Purchase Requisitions · Fusion SSP · D365 Purchase requisitions |

---

## 1. Pantallas compartidas de plataforma (Shell ERP)

Usadas por todos los módulos. En DDD son Platform Core.

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Login / SSO | Autenticar y seleccionar compañía/tenant | Todos | **MVP** |
| Home / Launchpad | Acceso a tiles/apps por rol | Todos | **MVP** |
| Búsqueda global | Encontrar documentos por folio/texto | Todos | Professional |
| Bandeja de aprobación (inbox) | Completar tareas de workflow | APPR | **MVP** |
| Notificaciones | Alertas in-app / centro de avisos | Todos | **MVP** |
| Mi perfil | Datos personales, preferencias, MFA | Todos | **MVP** |
| Mis favoritos / recientes | Atajos de productividad | Todos | Professional |
| Explorador de documentos / expediente | Ver anexos vinculados a transacciones | Todos | **MVP** |
| Visor de documento | Preview PDF/imagen | Todos | **MVP** |
| Subir evidencia | Cargar archivo a expediente | EMP/BUY/AP | **MVP** |
| Consulta de auditoría (por documento) | Trail before/after | AUD/APPR | **MVP** |
| Administración de usuarios | Alta/baja/lock | ADM | **MVP** |
| Roles y permisos | Matriz RBAC | ADM | **MVP** |
| Estructura organizacional | Unidades / centros de costo | ADM | **MVP** |
| Catálogos maestros (hub) | CRUD de listas de referencia | ADM | **MVP** |
| Definiciones de workflow | Diseñar/activar procesos de aprobación | ADM | Professional |
| Feature flags / módulos del tenant | Activar apps por compañía | ADM | Enterprise |
| Impersonación / soporte (break-glass) | Soporte controlado | ADM | Enterprise |

**Riesgo si se omiten (plataforma):** sin inbox y docs, el ERP no cierra ciclos aprobatorios ni deja evidencia; sin IAM/org/catalog el resto es demo hueca.

---

## 2. Finanzas — Contabilidad general (GL / Accounting)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Plan de cuentas | Mantener COA | GL/ADM | **MVP** |
| Periodos contables | Abrir/cerrar periodos | GL | **MVP** |
| Libro diario / asientos | Capturar y postear pólizas | GL | **MVP** |
| Consulta de cuenta / mayor | Ver movimientos por cuenta | GL/CFO | **MVP** |
| Balanza de comprobación | Validar cuadre | GL | **MVP** |
| Estados financieros (P&L, BS) | Reportes legales básicos | GL/CFO | **MVP** |
| Centros de costo / dimensiones | Estructura analítica | GL/ADM | Professional |
| Asientos recurrentes | Automatizar periódicos | GL | Professional |
| Asientos de asignación / distribución | Rateos | GL | Professional |
| Multi-compañía / intercompañía | Eliminaciones y IC | GL | Enterprise |
| Cierre contable asistido | Checklist de close | GL | Professional |
| Consolidación | Grupo de compañías | GL/CFO | Enterprise |
| Libro de impuestos / tax returns | Declaraciones | GL | Professional |
| Contabilidad de costos (CO) | Márgenes / absorción | GL | Enterprise |

**Dependencias:** IAM, Catalog (monedas, impuestos), Audit.  
**Riesgo omitir:** no hay libro de verdad; AP/AR/Treasury quedan como islas.

---

## 3. Cuentas por pagar (AP / CxP)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Lista de facturas de proveedor | Inbox operativo AP | AP | **MVP** |
| Registro / captura de factura | Crear obligación (con/sin OC) | AP | **MVP** |
| Detalle de factura proveedor | Ver match, retenciones, estado | AP | **MVP** |
| 3-way match workbench | Conciliar OC–Recepción–Factura | AP/BUY | Professional |
| Bloqueos y excepciones de match | Resolver diferencias de precio/cantidad | AP | Professional |
| Programación de pagos | Seleccionar facturas a pagar | AP/TRE | **MVP** |
| Notas de crédito proveedor | Ajustes | AP | Professional |
| Antigüedad de saldos AP | Aging | AP/CFO | **MVP** |
| Consulta de proveedor (saldo) | Posición del vendor | AP/BUY | **MVP** |
| Retenciones fiscales AP | ISR/IVA/retenciones | AP | Professional |
| Pagos masivos / propuesta de pago | Batch payment proposal | TRE/AP | Professional |
| Self-service portal proveedor | Estado de facturas (externo) | Vendor | Enterprise |

**Dependencias:** Purchasing (OC/GR), Document (CFDI/PDF), Treasury (pago), Accounting (asiento), Budget si tenant GOV (ACL).  
**Riesgo omitir:** “Pago” improvisado en compras; doble pago; sin control de obligaciones.

---

## 4. Cuentas por cobrar (AR / CxC)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Lista de facturas de cliente | Operación AR | AR | **MVP** |
| Detalle de factura cliente | Saldo, vencimiento, aplicaciones | AR | **MVP** |
| Registro de cobros / pagos recibidos | Aplicar dinero a facturas | AR/TRE | **MVP** |
| Notas de crédito cliente | Ajustes / devoluciones | AR | Professional |
| Antigüedad de saldos AR | Aging | AR/CFO | **MVP** |
| Estado de cuenta cliente | Extracto | AR/SAL | **MVP** |
| Cobranza / promesas de pago | Collections | AR | Professional |
| Dunning / recordatorios | Cartas de cobro | AR | Professional |
| Provisión de dudoso cobro | Estimaciones | AR/GL | Enterprise |
| Portal de cliente (self-service) | Ver facturas/pagar | Customer | Enterprise |

**Dependencias:** Billing/Sales, Treasury, Accounting, CRM (opcional).  
**Riesgo omitir:** ventas sin cobro controlado; caja desconectada del ingreso.

---

## 5. Facturación (Billing)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Emisión de factura / CFDI (o invoice) | Generar comprobante de cobro | AR/SAL | **MVP** |
| Lista de comprobantes emitidos | Seguimiento y reimpresión | AR | **MVP** |
| Cancelación / crédito fiscal | Anular o sustituir | AR | Professional |
| Facturación recurrente / suscripciones | Ciclos automáticos | AR | Enterprise |
| Facturación por proyecto / hitos | Billing PPM | PM/AR | Professional |
| Configuración de series / timbrado | Setup fiscal | ADM | Professional |
| Vista previa fiscal (XML/PDF) | Validar antes de timbrar | AR | Professional |

**Dependencias:** AR, Sales/Projects, Document, Tax config.  
**Pantallas compartidas:** Visor documento, Auditoría.  
**Riesgo omitir:** AR sin origen documental; en MX, incumplimiento CFDI si se promete facturación legal.

---

## 6. Tesorería (Treasury / Cash)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Cuentas bancarias | Maestro de bancos | TRE/ADM | **MVP** |
| Posición de efectivo | Saldo consolidado | TRE/CFO | **MVP** |
| Órdenes de pago | Ejecutar pagos AP/nómina | TRE | **MVP** |
| Registro de depósitos / cobros bancarios | Entrada de efectivo | TRE | **MVP** |
| Conciliación bancaria | Match extracto vs libro | TRE | **MVP** |
| Transferencias internas | Entre cuentas | TRE | Professional |
| Pronóstico de cash flow | Proyección | TRE/CFO | Professional |
| Pagos electrónicos / archivos bancarios | Generación de layouts | TRE | Professional |
| Gestión de riesgos / hedges | FX, derivados | TRE | Enterprise |
| Inversiones / deuda | Instrumentos | TRE | Enterprise |

**Dependencias:** AP, AR, Payroll, Accounting.  
**Riesgo omitir:** pagos sin conciliación; fraude y descuadre bancario.

---

## 7. Activo fijo (Fixed Assets)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Alta de activo | Capitalizar | GL/FA clerk | Professional |
| Lista / ficha de activo | Consulta patrimonial | GL | Professional |
| Depreciación (corrida) | Calcular/postear | GL | Professional |
| Baja / traspaso / revaluación | Ciclo de vida | GL | Professional |
| Inventario físico de activos | Conteo | AUD/GL | Enterprise |
| Activos en leasing | IFRS16/US GAAP | GL | Enterprise |

**Dependencias:** Accounting, Purchasing/AP (capitalización), Projects.  
**Riesgo omitir:** balance sin soporte patrimonial (aceptable diferir en MVP PyME).

---

## 8. Compras / P2P (Purchasing)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Mis requisiciones | Self-service empleado | EMP | **MVP** |
| Nueva requisición | Captura de necesidad | EMP/BUY | **MVP** |
| Detalle de requisición | Seguimiento + líneas | EMP/BUY | **MVP** |
| Lista de órdenes de compra | Workbench comprador | BUY | **MVP** |
| Crear / editar OC | Documento contractual de compra | BUY | **MVP** |
| Detalle de OC | Estado, recepciones, facturas | BUY | **MVP** |
| Recepción de mercancías / servicios | Goods/Service receipt | INV/EMP | **MVP** |
| Devolución a proveedor | Return delivery | INV/BUY | Professional |
| Solicitudes de cotización (RFQ) | Sourcing | BUY | Professional |
| Comparativo de cotizaciones | Award decision support | BUY | Professional |
| Contratos de compra | Agreement / blanket | BUY | Professional |
| Catálogo de compras / punch-out | Self-service catalog | EMP | Professional |
| Evaluación de proveedores | Scorecard | BUY | Enterprise |
| Análisis de gasto (spend) | Reporting compras | BUY/CFO | Enterprise |
| Service entry sheet | Servicios lean | EMP/BUY | Professional |

**Dependencias:** Workflow, Catalog, Document, Inventory, AP, (Budget si GOV).  
**Pantallas compartidas:** Inbox aprobación, Expediente, Auditoría.  
**Riesgo omitir:** no hay Source-to-Pay; núcleo del ERP operativo falla.

---

## 9. Proveedores (Supplier master / SRM light)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Lista de proveedores | Maestro | BUY/ADM | **MVP** |
| Ficha de proveedor | Datos fiscales, bancos, condiciones | BUY/ADM | **MVP** |
| Alta / onboarding proveedor | Captura y compliance | BUY | Professional |
| Calificación / bloqueo | Risk & status | BUY | Professional |
| Portal proveedor (RFQ/OC) | Colaboración externa | Vendor | Enterprise |

**Dependencias:** Purchasing, AP, Catalog.  
**Riesgo omitir:** OC sin maestro fiable; pagos a cuentas incorrectas.

---

## 10. Inventario

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Maestro de artículos / productos | Item master | ADM/INV | **MVP** |
| Consulta de existencias | Stock on hand | INV/BUY/SAL | **MVP** |
| Movimientos de inventario | Entradas/salidas/ajustes | INV | **MVP** |
| Transferencias entre almacenes | Traspasos | INV | Professional |
| Conteo cíclico / inventario físico | Cycle count | INV | Professional |
| Valuación de inventario | Cost layers | GL/INV | Professional |
| Reservas / ATP básico | Disponibilidad | SAL/INV | Professional |
| Lotes / series | Trazabilidad | INV | Enterprise |
| Kardex / historial de material | Trace | INV/AUD | Professional |

**Dependencias:** Purchasing (GR), Sales (GI), Accounting (costo).  
**Riesgo omitir:** compras/ventas sin control de stock (viable solo en servicios puros).

---

## 11. Almacén avanzado (WMS)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Mapa de ubicaciones (bins) | Topología | INV | Enterprise |
| Put-away / picking dirigido | Operación RF | INV | Enterprise |
| Wave / work management | Oleadas de picking | INV | Enterprise |
| Empaque / packing station | Embarque | INV | Enterprise |
| App móvil de almacén | Operación en piso | INV | Enterprise |

**Dependencias:** Inventory, Sales, Transportation.  
**Riesgo omitir:** ninguno en MVP; crítico en distribución.

---

## 12. Ventas / Order-to-Cash (Sales)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Lista de pedidos de venta | Order desk | SAL | **MVP** |
| Crear / editar pedido | Captura O2C | SAL | **MVP** |
| Detalle de pedido | Cumplimiento | SAL | **MVP** |
| Cotizaciones / quotes | Pre-pedido | SAL/CRM | Professional |
| Entregas / remisiones | Outbound delivery | INV/SAL | **MVP** |
| Lista de precios / descuentos | Pricing | ADM/SAL | Professional |
| Devoluciones de cliente | RMA | SAL/INV | Professional |
| Acuerdos de venta | Contracts | SAL | Enterprise |
| ATP / promesa de fecha | Order promising | SAL | Enterprise |
| Análisis de ventas | Reporting | SAL/CFO | Professional |

**Dependencias:** Inventory, Billing/AR, CRM, Pricing.  
**Riesgo omitir:** ERP sin ciclo de ingreso comercial (solo tiene sentido en holding solo-compras).

---

## 13. CRM

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Lista de leads | Captación | CRM | Professional |
| Oportunidades / pipeline | Forecast comercial | CRM | Professional |
| Cuentas / contactos | 360° cliente | CRM/SAL | Professional |
| Actividades / llamadas | Seguimiento | CRM | Professional |
| Campañas | Marketing light | CRM | Enterprise |
| Casos de servicio | Ticket postventa | CRM | Enterprise |
| Cotizador CPQ | Configure-price-quote | CRM/SAL | Enterprise |

**Dependencias:** Sales, AR.  
**Riesgo omitir:** se opera con Sales puro (aceptable en MVP).

---

## 14. Manufactura / MRP

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Lista de materiales (BOM) | Estructura de producto | MFG | Enterprise |
| Rutas / centros de trabajo | Routing | MFG | Enterprise |
| Órdenes de producción | Ejecución | MFG | Enterprise |
| MRP / planeación | Necesidades | MFG | Enterprise |
| Reporte de piso / confirmaciones | Shop floor | MFG | Enterprise |
| Calidad (inspecciones) | QM | MFG | Enterprise |
| Mantenimiento de planta (PM) | Work orders | MFG | Enterprise |

**Dependencias:** Inventory, Purchasing, Costing.  
**Riesgo omitir:** irrelevante para comercio/servicios; bloqueante para industria.

---

## 15. Logística / Transporte (TMS)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Planificación de embarques | Loads | INV/Logistics | Enterprise |
| Tracking de envíos | Visibilidad | SAL/INV | Enterprise |
| Costos de flete / landed cost | Costos logísticos | GL/INV | Enterprise |

**Dependencias:** WMS, Sales, Purchasing.  
**Prioridad:** Enterprise.

---

## 16. Proyectos (PPM / PSA)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Lista de proyectos | Portfolio | PM | Professional |
| Plan / WBS | Estructura | PM | Professional |
| Costos de proyecto | Actual vs budget | PM/GL | Professional |
| Timesheets | Captura de tiempo | EMP/PM | Professional |
| Facturación de proyecto | Hitos / T&M | PM/AR | Professional |
| Recursos / staffing | Capacidad | PM | Enterprise |

**Dependencias:** HR, Billing, Accounting, Purchasing.  
**Riesgo omitir:** empresas de servicios pierden control de margen.

---

## 17. Recursos humanos (HR)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Empleados (lista/ficha) | Master HR | HR | Professional |
| Altas / bajas / movimientos | Ciclo de vida | HR | Professional |
| Organigrama / posiciones | Estructura de puestos | HR/ADM | Professional |
| Asistencia / ausencias | Time off | EMP/HR | Professional |
| Autoservicio empleado (ESS) | Datos personales | EMP | Professional |
| Reclutamiento / vacantes | ATS light | HR | Enterprise |
| Desempeño / objetivos | Talent | HR | Enterprise |
| Beneficios | Enrollment | HR | Enterprise |

**Dependencias:** Org, Payroll, IAM (provisioning).  
**Riesgo omitir:** nómina sin maestro; viable externalizar HRIS al inicio.

---

## 18. Nómina (Payroll)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Parámetros de nómina | Tablas / incidencias | PAY | Professional |
| Captura de incidencias | Extra time, bonuses | PAY/HR | Professional |
| Corrida de nómina | Cálculo | PAY | Professional |
| Recibos / payslips | Consulta | EMP/PAY | Professional |
| Dispersión / archivo bancario | Pago | PAY/TRE | Professional |
| Finiquitos / liquidaciones | Término | PAY | Enterprise |
| Reportes patronales / impuestos laborales | Compliance | PAY | Professional |

**Dependencias:** HR, Treasury, Accounting.  
**Riesgo omitir:** crítico legalmente si se promete HCM completo; puede ser OUT del ERP core (integración).

---

## 19. Controlling / EPM light

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Presupuesto operativo (empresa) | Planning no-público | CFO/GL | Professional |
| Forecast | Rolling plan | CFO | Enterprise |
| Análisis de margen / rentabilidad | CO-PA style | CFO | Enterprise |
| Tablero ejecutivo CFO | KPIs | CFO | **MVP** (vista) |
| Conciliación / close dashboard | Close mgmt | GL | Enterprise |

**Dependencias:** GL, Sales, Projects.  
**Nota:** distinto del Public Budget GRP.

---

## 20. GRC / Compliance (Enterprise)

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Segregation of duties monitor | Conflictos de roles | AUD/ADM | Enterprise |
| Certificación de accesos | Access review | ADM/AUD | Enterprise |
| Controles financieros | Testing | AUD | Enterprise |
| Políticas y evidencias | Compliance vault | AUD | Enterprise |

**Dependencias:** IAM, Audit.  
**Riesgo omitir:** aceptable hasta Enterprise/SOX.

---

## 21. Reportes y Analytics transversales

| Pantalla | Objetivo | Usuario | Prioridad |
|----------|----------|---------|-----------|
| Reportes estándar por módulo | Operación | Varios | **MVP** |
| Diseñador de reportes / exports | Ad hoc | ADM/Power user | Professional |
| Tableros embebidos | BI operativo | CFO/Managers | Professional |
| Data export / lake feed | Integraciones | ADM | Enterprise |

---

## 22. Clasificación consolidada por nivel

### 22.1 MVP (operar empresa moderna “spine”)

**Plataforma:** Login, Launchpad, Inbox, Notificaciones, Perfil, Docs (lista/visor/upload), Auditoría por documento, Usuarios/Roles/Org/Catálogos.

**Compras:** Requisiciones, OC, Recepción, Proveedores (lista/ficha).

**Inventario light:** Artículos, Existencias, Movimientos.

**Ventas light:** Pedidos, Entregas.

**Finanzas:** COA, Periodos, Asientos, Mayor, Balanza, EEFF básicos, AP (lista/captura/detalle/aging/pago propuesto), AR (lista/detalle/cobro/aging), Billing emisión, Bancos, Órdenes de pago, Conciliación, Posición de efectivo.

**Ejecutivo:** Tablero CFO básico.

### 22.2 Professional (sumar)

RFQ/contratos/catálogo compras, 3-way match, retenciones, NC AP/AR, cobranza, cancelación fiscal, cash forecast, activo fijo, CRM básico, precios, devoluciones, conteos, valuación, proyectos/timesheets, HR+Payroll core, presupuesto operativo, reportes ad hoc, definiciones workflow.

### 22.3 Enterprise (sumar)

WMS, TMS, manufactura/MRP/QM/PM, CPQ/campañas/portal cliente-proveedor, consolidación IC, leasing, hedge/deuda, talent/ATS, SoD/GRC, feature flags multi-compañía, analytics lake, landed cost, ATP avanzado.

---

## 23. Pantallas compartidas (reuso obligatorio)

| Pantalla compartida | Módulos consumidores |
|---------------------|----------------------|
| Bandeja de aprobación | Purchasing, AP, AR credits, HR movements, Projects |
| Expediente / visor / upload | Todos los documentos de negocio |
| Ficha de tercero (Customer/Vendor 360) | Sales, AR, Purchasing, AP |
| Consulta de auditoría | Todos |
| Maestro de artículo | Inventory, Purchasing, Sales, MFG |
| Selector de dimensiones (CC, proyecto) | GL, AP, AR, Purchasing, Projects |
| Propuesta / ejecución de pago | AP, Payroll → Treasury |
| Tablero de excepciones (match, stock negativo, banco) | AP, INV, TRE |

**Justificación DDD:** son *generic subdomains* de UI; no deben copiarse por módulo (anti-patrón “MyInbox” por app).

---

## 24. Dependencias entre módulos (pantallas)

```text
IAM/Org/Catalog ──► todas
Workflow inbox ──► Purchasing, AP, HR, Projects
Purchasing GR ──► Inventory + AP match
Sales delivery ──► Inventory + Billing/AR
Billing ──► AR
AP / AR / Payroll ──► Treasury ──► Accounting
FA / Inventory valuation ──► Accounting
CRM ──► Sales quotes/orders
MFG ──► Inventory + Purchasing (MRP)
Projects ──► Billing + HR timesheets + Purchasing
```

---

## 25. Riesgos globales si se omiten pantallas clave

| Omisión | Impacto |
|---------|---------|
| Sin **Inbox** | Aprobaciones por email/chat; no auditable |
| Sin **AP** (solo “pagar OC”) | Obligaciones no controladas; riesgo de doble pago |
| Sin **AR/Billing** | Ventas sin cobro ni comprobante |
| Sin **Tesorería/conciliación** | Caja ciega; fraude |
| Sin **GL** | Subledgers huérfanos; no hay cierre |
| Sin **Recepción** | 3-way match imposible; inventario mentiroso |
| Sin **Docs/Audit** | ERP no defendible ante auditoría |
| Meter WMS/MFG en MVP | Infla scope; atrasa finanzas y P2P |
| Unificar pantallas ERP Invoice con GRP Liquidación | Contamina lenguaje; romper ACL DDD-PORT-001 |

---

## 26. Trazabilidad a Bounded Contexts (DDD-PORT-001)

| Módulo de pantallas | BC / servicio |
|---------------------|---------------|
| Shell / IAM / Org / Catalog / WF / Doc / Audit | Platform |
| GL | `accounting-service` |
| AP | `ap-service` (Oleada 2) |
| AR / Billing | `ar-service` / `billing-service` |
| Treasury | `treasury-service` |
| FA | `asset-service` |
| Purchasing / Supplier | `procurement-service` |
| Inventory / WMS | `inventory-service` (+ wms) |
| Sales / CRM | `sales-service` / `crm-service` |
| MFG | `manufacturing-service` |
| Projects | `project-service` |
| HR / Payroll | `hr-service` / `payroll-service` |

---

## 27. Conteo orientativo

| Nivel | Pantallas aprox. (únicas) |
|-------|---------------------------|
| MVP | ~55–65 |
| + Professional | ~110–130 |
| + Enterprise | ~180–220 |

> Conteo funcional (no incluye variantes móviles ni cada reporte individual como pantalla separada).

---

## 28. Fuera de este inventario (GRP)

No listadas aquí (ver portfolio GRP): Public Budget, Public Procurement (licitación), Tax & Collection ciudadana, Citizen portal, Social Programs, Public Works, Transparency, Oversight/Cuenta Pública.

---

## 29. Próximos pasos recomendados (`feat-ERP`)

1. Congelar **subset MVP** de este inventario como Scope Freeze ERP.  
2. Cruzar cada pantalla MVP con OpenAPI/eventos existentes o gaps.  
3. Recién entonces generar wireframes/HTML preview (explícitamente fuera de este entregable).

---

## 30. Referentes de mercado (síntesis)

| Suite | Patrón de pantallas observado |
|-------|-------------------------------|
| SAP S/4HANA Fiori | Apps atómicas por rol (Manage*, My Inbox, Supplier Invoice, Sales Order) |
| Oracle Fusion | Work areas por pillar (Financials, Procurement, SCM, PPM) + Springboard |
| Dynamics 365 | Workspaces + list pages + fact boxes (F&O) |
| NetSuite | Centers por rol + transactions + lists + saved searches |
| Infor | Homepages + in-context drill + industry clouds |
| Odoo Enterprise | Apps modulares con form/list/kanban por modelo |

Este inventario unifica esos patrones en un **lenguaje de producto propio**, alineado a nuestros BCs, sin copiar IDs propietarios como requisito de implementación.

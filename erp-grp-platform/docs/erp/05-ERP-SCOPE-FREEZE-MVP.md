# ERP Scope Freeze — MVP
## ERP-SF-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-SF-001 |
| Título | Scope Freeze ERP MVP (capa privada / comercial) |
| Tipo | Product Freeze · Definition of Ready ejecutivo |
| Estado | **Aprobado (VoBo)** — `feat-ERP` · 2026-11-07 |
| Entradas | ERP-SI-001 · ERP-FM-001 · ERP-XR-001 · ERP-UX-001 · DDD-PORT-001 |
| Complemento | ERP-CP-001 (Control Pack) |
| Piloto de referencia | ACME Industrial (MX) — demo `erp-preview/` |

> **Regla:** lo no listado en **IN** queda **OUT** del primer release ERP.  
> Cambios post-firma requieren enmienda versionada (`ERP-SF-001.rN`) firmada por DG + CFO + Controller.

---

## 1. Declaración de congelamiento

Queda congelado el **ERP MVP Spine**:

**Purchase-to-Pay (P2P) + Order-to-Cash light (O2C) + Finanzas operativas (GL/AP/AR/Billing/Treasury) + Inventario básico + Plataforma (IAM/WF/Docs/Audit/Catalog).**

Fuera del freeze: manufactura, WMS avanzado, TMS, CPQ, portales, GRP/CONAC, consolidación intercompañía, GRC studio, payroll profundo (ver Gate A).

---

## 2. Gate A — Decisiones de producto (congeladas propuestas)

| # | Decisión | Valor freeze | Implicación |
|---|----------|--------------|-------------|
| A1 | País / localización MVP | **MX-first** | Catálogos fiscales MX; CFDI como capacidad Billing; validaciones RFC |
| A2 | CFDI | **IN (emisión + UUID en AP opcional/condicional)** | Billing emite; AP captura `cfdi_uuid` si política compañía lo exige |
| A3 | Retenciones (ISR/IVA) | **IN (Control Pack)** | Campos withholding en AP Invoice + config tax |
| A4 | Payroll / Nómina | **OUT del ERP MVP release-1** | Pantallas demo = stub Professional; sin IMSS/CURP obligatorios en release-1 |
| A5 | Multi-moneda | **IN light** | Docs permiten `currency` ≠ funcional; **obligatorio** `exchange_rate` + `rate_date` si currency ≠ company currency |
| A6 | Match PO/GR/AP | **Híbrido** | STOCK / bienes: **3-way**; SERVICE: **2-way** (PO↔AP) salvo flag `gr_based_invoice` |
| A7 | Crédito cliente | **IN (hard stop)** | `credit_block` / exposición bloquea confirmación SO y emisión AR |
| A8 | Dual control pagos | **IN** | Órdenes de pago > umbral config requieren 2º aprobador ≠ solicitante |
| A9 | Park / Post | **IN** | Crear ≠ Postear en Journal, AP, AR Receipt, Bank Payment |
| A10 | Multi-compañía | **IN (1–N legal entities en mismo tenant)** | `legal_entity_id` obligatorio en todo documento transaccional |

**Firmas Gate A (VoBo)**

| Rol | Nombre | Fecha | Sí/No |
|-----|--------|-------|-------|
| Director General | Product owner (chat VoBo) | 2026-11-07 | Sí |
| CFO | Product owner (chat VoBo) | 2026-11-07 | Sí |
| Controller | Product owner (chat VoBo) | 2026-11-07 | Sí |

> VoBo registrado en conversación de Cloud Agent: Freeze + Control Pack aceptados (“lo veo bien / check marcado”). Umbrales piloto ACME (ERP-CP-001 §3) aplican salvo enmienda.

---

## 3. Gate C — Object Pages MVP (IN — diseñar/construir)

Únicas fichas/object pages del release-1 (lista + detalle + captura según SI):

### 3.1 Plataforma (shell)

| Object / pantalla | Notas |
|-------------------|--------|
| Login / company select | |
| Home / Launchpad por rol | |
| Bandeja de aprobación | Shell único |
| Notificaciones | |
| Mi perfil | |
| Expediente / Visor / Subir evidencia | Shell único |
| Consulta auditoría por documento | |
| Usuarios · Roles · Org · Catálogos | Admin mínimo |

### 3.2 Master data

| Object | Notas |
|--------|--------|
| Proveedor (Vendor) | Incluye banco + hold |
| Cliente (Customer) | Incluye crédito |
| Artículo (Item) | STOCK/SERVICE + costeo |
| Cuenta contable / COA | |
| Periodo contable | |
| Cuenta bancaria | |
| Centro de costo / OU | vía Org |

### 3.3 P2P

| Object | Notas |
|--------|--------|
| Requisición (PR) | |
| Orden de compra (PO) | |
| Recepción (GR) | |
| Factura proveedor (AP Invoice) | + match panel |
| Propuesta / programación de pagos | |
| Aging AP · saldo proveedor | Consultas |

### 3.4 O2C + Billing

| Object | Notas |
|--------|--------|
| Pedido de venta (SO) | + credit check |
| Entrega / remisión | |
| Factura cliente / CFDI (AR Invoice / Billing) | |
| Cobro / receipt | |
| Aging AR · estado de cuenta | Consultas |

### 3.5 GL + Treasury

| Object | Notas |
|--------|--------|
| Asiento / Journal | park/post |
| Mayor / Balanza / EEFF básicos | Consultas/reportes |
| Orden de pago bancaria | dual control |
| Conciliación bancaria | |
| Posición de efectivo | |

### 3.6 Inventario

| Object | Notas |
|--------|--------|
| Existencias (ATP) | on hand / reserved / available |
| Movimiento de inventario | IN/OUT/TRANSFER/ADJUST |

### 3.7 Analytics

| Object | Notas |
|--------|--------|
| Dashboard ejecutivo / por rol | KPIs spine |
| Reportes estándar (export) | Sin BI embebido |

**Total orientativo:** ~45 pantallas MVP SI (listas+fichas+consultas) — **no** expandir a Professional/Enterprise en release-1.

---

## 4. OUT explícito (prohibido en release-1)

| Dominio | OUT |
|---------|-----|
| Manufactura | MRP, BOM, MO, capacity, shop floor |
| WMS | bins, waves, putaway, RF avanzado |
| TMS / flota | |
| CPQ / suscripciones | |
| Portales | proveedor, cliente, empleado ESS avanzado |
| GRP / público | presupuesto CONAC, obra pública, transparencia, ciudadano |
| Payroll profundo | incidencias IMSS, timbrado nómina, dispersión productiva |
| Activo fijo profundo | altas masivas, bajas complejas (stub OK en demo) |
| Proyectos profundo | WBS costeo avanzado (stub OK) |
| Tesorería avanzada | hedges, debt, leasing, cash pooling |
| GRC | SoD matrix rica, impersonación, audit studio |
| Intercompany | consolidación, eliminaciones |
| CRM avanzado | opportunity pipeline completo |

---

## 5. Roles release-1 (RBAC mínimo)

| Código | Rol | Capacidades núcleo |
|--------|-----|-------------------|
| EMP | Solicitante | PR create/submit |
| BUY | Comprador | PR→PO, vendor (read/write limitado) |
| INV | Almacén | GR, stock, movements |
| SAL | Vendedor | SO, delivery request, billing request |
| AP | Contador CxP | AP invoice park/post, payment proposal |
| AR | Contador CxC | AR invoice, receipts |
| GL | Contador general | Journals, periods, COA (con ADM) |
| TRE | Tesorería | Bank payments (maker), recon, cash |
| TRE2 | Tesorería aprobador | Dual control payments (≠ TRE maker) |
| APPR | Manager | Inbox approvals |
| ADM | Admin | Users, roles, catalogs, org |
| CFO | Director financiero | Read + approve high-value; dashboards |
| AUD | Auditor | Audit read-only |
| DG | Dirección | Dashboards / approve excepciones |

**SoD mínima (no negociable):**

1. Quien crea/modifica **cuenta bancaria vendor** ≠ quien **aprueba pago**.  
2. **TRE maker** ≠ **TRE2** en el mismo payment.  
3. Quien **park** asiento/AP ≠ obligatorio mismo usuario que **post** (permisos separados; mismo user solo si policy lo permite y queda auditado).  
4. Vendor master bank change → WF + before/after audit.

---

## 6. Flujos de dinero y control (Gate D)

Toda transición con impacto monetario exige:

| Control | Requisito |
|---------|-----------|
| Permiso RBAC | Acción explícita |
| Workflow o dual control | Según matriz de umbrales |
| AuditFact | before/after + actor + timestamp |
| Idempotency-Key | En approve/post/pay |
| Legal entity | `legal_entity_id` en header |
| Periodo | Posting solo si periodo OPEN (o soft-close policy) |

Estados canónicos (no inventar otros en release-1):

- **PR:** DRAFT → SUBMITTED → APPROVED/REJECTED → CLOSED  
- **PO:** DRAFT → PENDING_APPROVAL → APPROVED → SENT → PARTIALLY_RECEIVED → RECEIVED → CLOSED  
- **GR:** DRAFT → POSTED  
- **AP Invoice:** DRAFT → PENDING_APPROVAL → POSTED → PARTIALLY_PAID → PAID / VOID  
- **Payment:** DRAFT → PENDING_DUAL → APPROVED → SENT → CLEARED  
- **SO:** DRAFT → CREDIT_HOLD/CONFIRMED → DELIVERED → INVOICED → CLOSED  
- **AR Invoice:** DRAFT → ISSUED → PARTIALLY_PAID → PAID / VOID  
- **Journal:** DRAFT → POSTED / VOID  

---

## 7. Servicios / bounded contexts (mapa release-1)

| Servicio | Ownership release-1 | Nota |
|----------|---------------------|------|
| iam-service | IN | Ya core |
| catalog-service | IN | Masters + numbering series config |
| workflow-service | IN | PR/PO/AP/Payment/SO credit override |
| document-service | IN | Expedientes |
| audit-service | IN | Trail |
| procurement-service | IN | PR, PO, GR, Vendor |
| inventory-service | IN | Stock, movements, ATP |
| finance-ap-service *o* finance-service módulo AP | IN | AP + payment proposal |
| finance-ar-service *o* módulo AR/Billing | IN | SO link, AR, CFDI emit stub/adapter |
| accounting-service (GL) | IN | COA, periods, journals, postings |
| treasury-service | IN | Banks, payments execution, recon |
| payroll-service | **OUT** release-1 | |
| budget-service (GRP) | **OUT** ERP MVP | Dominio GRP |

\* Decisión de empaquetado micro vs modular monorepo: ADR posterior; **no compartir BD** entre AP/AR/GL/Payroll/Procurement.

---

## 8. Criterios de aceptación del Freeze (DoR)

El ERP MVP está **Ready para OpenAPI / Angular / Flyway** solo si:

- [x] Gate A documentado (este doc §2)  
- [x] Gate A VoBo DG+CFO+Controller (2026-11-07)  
- [x] Object Pages IN/OUT publicados (§3–§4)  
- [x] Control Pack ERP-CP-001 publicado y referenciado  
- [x] Delta Control Pack volcado en ERP-FM-001 (§19)  
- [x] SoD mínima publicada (§5)  
- [x] Umbrales numéricos piloto ACME adoptados (ERP-CP-001 §3) — ajustables por enmienda  
- [ ] Owner técnico asignado por servicio §7  

**Demo HTML (`erp-preview`) no sustituye este Freeze** — es especificación UX, no DoR de ingeniería.

---

## 9. Enmiendas

| Rev | Fecha | Cambio | Firmas |
|-----|-------|--------|--------|
| r0 | 2026-11-07 | Creación propuesta Freeze MVP | pendientes |

---

## 10. Próximos documentos (post-firma)

1. OpenAPI + eventos por servicio IN (§7)  
2. ERD/Flyway finance-procurement-inventory  
3. Angular app shell + Object Pages Gate C  
4. Config umbrales / series / tolerancias (no pantallas usuario)

---

**Fin ERP-SF-001**

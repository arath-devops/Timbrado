# Briefing para diseño modular de esquema de BD — ERP completo
## ERP-DB-BRIEF-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-DB-BRIEF-001 |
| Propósito | Contexto completo del producto para que **otra IA / arquitecto de datos** diseñe el esquema de BD **modular por bounded context** |
| Idioma | Español (identificadores técnicos EN) |
| Congelamiento | **ERP-SF-001** (VoBo 2026-11-07) |
| ADR crítico | **ADR-014** — ERP comercial **sin** `budget-service` / GRP |
| Repo | `arath-devops/Timbrado` · carpeta `erp-grp-platform/` |
| UI carcasa actual | rama `feat-menu` (login + shell + bandeja + catálogos) |
| Estado de este briefing | Listo para consumo externo · 2026-11-11 |

> **Instrucción para la IA receptora:** lee este documento de punta a punta. Produce esquemas PostgreSQL **por servicio/BD**, no un monolito. No inventes módulos FUERA del Freeze. No mezcles GRP/presupuesto público.

---

## 0. Qué se te pide (entregable esperado)

Diseñar / modularizar el modelo de datos del ERP MVP de forma que:

1. Haya **una base de datos lógica por microservicio** (database-per-service).
2. Cada BD sea **autosuficiente** para su dominio; las referencias cross-service usan **IDs externos** (UUID) + eventos, **no** FK físicas entre BDs.
3. Se respeten multi-tenant (`tenant_id`), multi-compañía (`legal_entity_id`), auditoría, optimistic locking (`version`), soft-status e idempotencia.
4. El diseño cubra **todos los módulos DENTRO** del Freeze (plataforma + P2P + O2C ligero + finanzas + inventario).
5. Se entregue:
   - Inventario de tablas por BD
   - DDL PostgreSQL sugerido (o al menos columnas clave + PK/UK/índices)
   - Enums / check constraints de estados
   - Mapa de relaciones **lógicas** entre servicios
   - Notas de outbox / idempotency keys donde aplique
   - Lista explícita de lo **excluido** (GRP, nómina, WMS, etc.)

**No** se pide implementar código de aplicación. **Sí** se pide un modelo de datos alineado a microservicios.

---

## 1. Identidad del producto

| Aspecto | Decisión |
|---------|----------|
| Producto | **ERP comercial / privado** (piloto ACME Industrial, México) |
| No es | GRP (gobierno), presupuesto CONAC, portal ciudadano |
| Localización MVP | **México primero** — RFC, CFDI 4.0, catálogos SAT |
| Idioma UI | Español |
| Login | **3 campos:** empresa + usuario + password (el usuario **no** elige rol; admin asigna permisos/módulos) |
| Arquitectura | Microservicios Spring Boot + API Gateway + Kafka (eventos) + PostgreSQL |
| UI actual | Carcasa HTML estática en `iam-service` (`login.html`, `shell.html`) + `dev-preview/` |
| Stack previsto UI | Angular (object pages) detrás del Gateway |

### Separación ERP vs GRP (ADR-014)

- `procurement-service` **no** llama a `budget-service`.
- **No** existen `allocationId` / `budgetMovementId` en contratos ERP.
- Aprobación de OC = **workflow + umbrales + Control Pack**, no fondos públicos.
- Topics `grp.budget.*` **no** tienen consumidores ERP.
- Cualquier columna `budget_item_id` legada en borradores de esquema **debe eliminarse** del track ERP.

---

## 2. Principios de modelado (obligatorios)

### 2.1 Database-per-service

| Servicio | BD | Dominio |
|----------|-----|---------|
| `iam-service` | `iam_db` | Identidad, roles, permisos, org scopes, sesiones |
| `catalog-service` | `catalog_db` | Catálogos referencia, series folio, umbrales/políticas, tax codes |
| `workflow-service` | `workflow_db` | Definiciones de proceso, instancias, tareas, decisiones |
| `document-service` | `document_db` | Expedientes / case files / adjuntos metadata |
| `audit-service` | `audit_db` | Rastro append-only |
| `procurement-service` | `procurement_db` | Proveedor, PR, OC, (GR si vive aquí) |
| `inventory-service` | `inventory_db` | Artículos, almacenes ligeros, stock, ATP, movimientos, entregas |
| `ap-service` | `ap_db` | Facturas proveedor, match, propuestas de pago |
| `ar-billing-service` | `ar_db` | Clientes/crédito, SO, facturas cliente/CFDI port, cobros |
| `accounting-service` | `accounting_db` | COA, periodos, asientos, saldos |
| `treasury-service` | `treasury_db` | Cuentas bancarias empresa, pagos, extractos, conciliación |

**Prohibido:** una sola BD compartida entre CxP / CxC / Contabilidad / Compras / Nómina.

### 2.2 Columnas transversales sugeridas (toda tabla de negocio)

```text
id              UUID PK          -- generado por aplicación
tenant_id       UUID NOT NULL
legal_entity_id UUID             -- obligatorio en documentos transaccionales
created_at      TIMESTAMPTZ
created_by      UUID|VARCHAR
updated_at / modified_at
updated_by / modified_by
version         BIGINT           -- optimistic lock
```

Índices típicos: `(tenant_id, …)`, uniqueness siempre **scoped por tenant** (y a menudo por `legal_entity_id`).

### 2.3 Patrones

| Patrón | Regla |
|--------|--------|
| Soft delete | Preferir `status` / `active` boolean; no borrar físico si ya se usó en TX |
| Park vs Post | Documentos financieros: `DRAFT` ≠ `POSTED`; posteos inmutables o con reverse |
| Idempotencia | Claves en approve / post / pay / complete-task |
| Outbox | Eventos de dominio salen vía outbox por servicio (no dual-write silencioso) |
| Multi-moneda ligera | Si `currency ≠` moneda funcional → `exchange_rate` + `rate_date` obligatorios |
| Match | STOCK = 3-way (OC/GR/factura); SERVICE = 2-way salvo `gr_based_invoice` |
| Dual control pagos | Preparador ≠ aprobador; umbral configurable |
| Crédito | Hard block: `credit_block` / exposición bloquean confirmar SO y emitir CxC |

---

## 3. Alcance funcional DENTRO (Freeze)

### 3.1 Plataforma

- Login / shell / menú por módulos JWT
- Bandeja de aprobación unificada
- Notificaciones (mínimo)
- Mi perfil
- Expediente / visor / subir evidencia
- Consulta de auditoría por documento
- Usuarios · Roles · Organización · Catálogos

### 3.2 Maestros

| Maestro | Dueño BD | Notas |
|---------|----------|-------|
| Proveedor (+ banco + hold) | `procurement_db` | |
| Cliente (+ crédito) | `ar_db` | |
| Artículo STOCK/SERVICE + costeo | `inventory_db` | |
| Plan de cuentas | `accounting_db` | |
| Periodo contable | `accounting_db` | |
| Cuenta bancaria empresa | `treasury_db` | |
| Centro de costo / OU | `iam_db` (org) y/o catálogo | |

### 3.3 P2P — Compra a pago

Requisición → OC → Recepción → Factura CxP (+ match) → Propuesta de pago → Pago tesorería → Contabilización.

Consultas: antigüedad CxP, saldo proveedor.

### 3.4 O2C ligero + facturación

Pedido venta (+ crédito) → Entrega/remisión → Factura cliente / CFDI → Cobro/aplicación.

Consultas: antigüedad CxC, estado de cuenta.

### 3.5 Contabilidad + tesorería

Asientos (guardar/contabilizar), mayor/balanza básica, orden de pago bancaria (dual), conciliación, posición de efectivo.

### 3.6 Inventario

Existencias (on hand / reserved / ATP), movimientos IN/OUT/TRANSFER/ADJUST.

### 3.7 Analítica

Dashboards por rol + reportes exportables (sin BI embebido). Suele ser **lectura** sobre vistas/replicas; no inventar data warehouse en MVP salvo tablas de hecho mínimas si se justifican.

---

## 4. FUERA explícito (no modelar en release-1)

Manufactura (MRP/BOM/OF), WMS avanzado, TMS, CPQ, portales, **GRP/CONAC/presupuesto público**, nómina profunda, activo fijo profundo, proyectos profundos, tesorería avanzada (coberturas/leasing), GRC rico, consolidación intercompañía, CRM embudo completo.

---

## 5. Módulos de menú / claims JWT

```json
"modules": [
  "core.iam", "core.catalog", "core.workflow", "core.document", "core.audit",
  "erp.procurement", "erp.inventory", "erp.ap", "erp.ar", "erp.billing",
  "erp.accounting", "erp.treasury"
]
```

Sin `grp.*` en el cliente ERP.

Login **no** pide rol. Admin asigna roles/permisos/módulos visibles.

---

## 6. Roles Freeze (RBAC mínimo)

| Código | Rol |
|--------|-----|
| EMP | Solicitante |
| BUY | Comprador |
| INV | Almacén |
| SAL | Vendedor |
| AP | Contador CxP |
| AR | Contador CxC |
| GL | Contador general |
| TRE / TRE2 | Tesorería ejecutor / aprobador (≠ misma persona en dual) |
| APPR | Gerente / aprobador bandeja |
| ADM | Administrador |
| CFO | Director financiero |
| AUD | Auditor (solo lectura) |
| DG | Dirección general |

### SoD no negociable

1. Quien crea/modifica banco del **proveedor** ≠ quien aprueba el **pago**.
2. TRE ejecutor ≠ TRE2 aprobador en el mismo pago.
3. Guardar vs contabilizar = permisos separados.
4. Cambio de banco proveedor → workflow + auditoría before/after.

---

## 7. Workflows (6 procesos) — `workflow_db`

| processKey | Disparador | Resultado |
|------------|------------|-----------|
| `erp.pr.approve` | PR submitted | APPROVED / REJECTED |
| `erp.po.approve` | PO submitted | APPROVED / REJECTED (**sin** budget) |
| `erp.ap.match_exception` | Match fuera de tolerancia | FORCE_MATCH / BLOCK / RETURN… |
| `erp.ap.payment_dual` | PaymentProposalCreated | Aprobado → treasury ejecuta |
| `erp.ar.credit_exception` | Crédito falla / SO sobre límite | Hold / Release / Override |
| `erp.gl.period_close` | Cierre de periodo | CLOSED (SoD estricto) |

Entidades típicas a modelar:

- `process_definition` (process_key, version, steps JSON)
- `process_instance` (business_ref_type/id, status, variables)
- `task` (assignee/role, status OPEN/COMPLETED, due/SLA)
- `task_decision` (APPROVE/REJECT + comment ≥ 5 en reject)
- Idempotency en `complete_task`

Umbrales seed ACME (MXN, ejemplo): `po_manager=50000`, `po_finance=200000`, dual payment threshold, tolerancias match %.

---

## 8. Eventos de dominio (Kafka) — contratos lógicos

Envelope CloudEvents + `tenantId` / `legalEntityId` / `correlationId` / `causationId`.

### Procurement / Inventory

`PurchaseRequisitionSubmitted/Approved`, `PurchaseOrderCreated/Submitted/Approved/Rejected/Cancelled`, `GoodsReceiptPosted/Reversed`

### AP / Treasury

`VendorInvoiceReceived`, `ThreeWayMatchCompleted`, `VendorInvoiceApproved/Blocked`, `PaymentProposalCreated/Approved`, `PaymentExecuted`, `BankStatementImported`, `BankReconciliationCompleted`

### AR / Billing

`CustomerCreditChecked`, `SalesOrderConfirmed`, `DeliveryPosted`, `CustomerInvoiceIssued`, `CustomerPaymentApplied`, `CreditHoldPlaced/Released`

### Accounting / masters

`JournalEntryPosted`, `PeriodClosed/Reopened`, `VendorCreated/Updated`, `CustomerCreated/Updated`, `ItemCreated/Updated`

### Topics sugeridos

`erp.procurement.v1`, `erp.inventory.v1`, `erp.ap.v1`, `erp.ar.v1`, `erp.treasury.v1`, `erp.accounting.v1`, `platform.workflow.v1`, `platform.audit.v1`

**No** consumir `BudgetCommitted/Released/CommitFailed`.

---

## 9. Catálogos (`catalog_db`) — ERP-CAT-001

### 9.1 Distinción crítica

| Tipo | Ejemplo | ¿En Catálogos? |
|------|---------|----------------|
| A. Referencia editable | UOM, PAYMENT_TERMS, TAX, DOC_TYPE | Sí |
| B. Config sistema | Series folio, umbrales WF, tolerancias | Sí (admin) |
| C. SAT CFDI 4.0 | UsoCFDI, FormaPago, RégimenFiscal, ClaveProdServ | Seed **solo lectura** |
| D. Maestro negocio | Proveedor, Cliente, Artículo, COA, Banco empresa | **No** — viven en su servicio |
| E. Seguridad | Roles/permisos | IAM |

### 9.2 Operativos MVP (UI carcasa ya incluye subset)

CURRENCY, UOM, PAYMENT_TERMS, TAX, TAX_WH, DOC_TYPE, PAYMENT_METHOD, BANK_CODE, COUNTRY, ACCOUNT_ASSIGNMENT, ITEM_TYPE, COSTING_METHOD, PRIORITY, HOLD_REASON, MATCH_RESOLUTION, CREDIT_CHECK_RESULT, WF_PROCESS, MODULE, PERMISSION, ROLE, LOCALE, MIME_ALLOW

### 9.3 SAT (consulta)

c_FormaPago, c_MetodoPago, c_UsoCFDI, c_RegimenFiscal, c_Moneda, c_ClaveUnidad, c_Impuesto, c_TipoFactor, c_TasaOCuota, c_ObjetoImp, c_TipoRelacion, c_Exportacion, c_ClaveProdServ (~52k → búsqueda, no grilla completa)

### 9.4 Series de folio

Por `legal_entity` + doc type: PR, PO, GR, VI, SO, CI, DN, JE, PY, RC, PP — con `prefix`, `year_reset`, `padding`, `next_value` atómico.

### 9.5 Modelo sugerido mínimo

```text
catalog_type (code, name, editable, source=INTERNAL|SAT)
catalog_item (catalog_code, item_code, item_name, active, attributes JSONB)
numbering_series (...)
policy_threshold (key, legal_entity_id?, value JSON/numeric)
```

---

## 10. Inventario de entidades por BD (checklist para el diseñador)

### `iam_db`

- tenant / legal_entity (si vive aquí) / org_unit
- user_account, role, user_role, permission/module grants
- org_scope_grant (OU_SUBTREE / OU_EXACT)
- session, refresh/token metadata si aplica
- (opcional) password policy / lockout

### `catalog_db`

- ver §9

### `workflow_db`

- ver §7

### `document_db`

- case_file / expediente ligado a `business_type` + `business_id` + tenant/LE
- document_object (mime, hash, storage_key, doc_type)
- link a DOC_TYPE del catálogo

### `audit_db`

- audit_event append-only: actor, action, entity_type/id, before/after JSON, ts, correlation_id
- índices por documento y por tenant/tiempo
- **sin updates/deletes** de negocio

### `procurement_db`

- vendor (+ tax ids RFC, payment_terms, hold_reason, status)
- vendor_bank_account (SoD sensible)
- purchase_requisition + lines
- purchase_order + lines (currency, rate, cost_center/assignment)
- goods_receipt + lines (si GR es dueño procurement; si no, contrato claro con inventory)
- refs a item_id / warehouse como UUID externos

### `inventory_db`

- item (STOCK/SERVICE, uom, costing_method)
- warehouse / location ligera (no WMS)
- stock_balance (on_hand, reserved, ATP)
- inventory_movement + lines
- delivery_note / remisión (O2C) si es dueño inventory
- reservation links a SO/PO

### `ap_db`

- vendor_invoice + lines (tax, withholdings, cfdi_uuid opcional)
- match_result / match_exception
- payment_proposal + lines
- vendor_balance / aging projections (tabla o vista materializada)

### `ar_db`

- customer (+ credit_limit, credit_block, exposure)
- sales_order + lines
- customer_invoice + lines (+ CFDI stamp fields: uuid, status, xml_ref)
- payment_receipt / application (aplicar a facturas)
- credit_hold records

### `accounting_db`

- chart_of_accounts, account
- accounting_period (OPEN/CLOSING/CLOSED)
- journal_entry + journal_line (balanced check)
- balances / trial balance support
- **sin** `budget_item_id`

### `treasury_db`

- house_bank / company_bank_account
- payment_order / payment_execution (dual status)
- bank_statement + lines
- reconciliation matches
- cash_position snapshots (opcional MVP)

---

## 11. Estados canónicos (no inventar otros en release-1)

| Código | Uso |
|--------|-----|
| DRAFT | Borrador |
| SUBMITTED / PENDING_APPROVAL | Enviado / en bandeja |
| APPROVED / REJECTED | Decisión WF |
| SENT | Enviado a proveedor/banco |
| PARTIALLY_RECEIVED / RECEIVED | Recepción |
| POSTED | Contabilizado |
| PARTIALLY_PAID / PAID | Pagos |
| ISSUED | Factura cliente emitida |
| CONFIRMED / DELIVERED / INVOICED | Ciclo SO |
| CREDIT_HOLD | Retención crédito |
| PENDING_DUAL | Dual control |
| CLEARED | Conciliado |
| CLOSED / VOID | Cierre / anulación |

Ciclos resumidos:

- PR: DRAFT → SUBMITTED → APPROVED/REJECTED → CLOSED  
- OC: DRAFT → PENDING_APPROVAL → APPROVED → SENT → PARTIALLY_RECEIVED → RECEIVED → CLOSED  
- GR: DRAFT → POSTED  
- VI (CxP): DRAFT → PENDING_APPROVAL → POSTED → PARTIALLY_PAID → PAID / VOID  
- Pago: DRAFT → PENDING_DUAL → APPROVED → SENT → CLEARED  
- SO: DRAFT → CREDIT_HOLD/CONFIRMED → DELIVERED → INVOICED → CLOSED  
- CI (CxC): DRAFT → ISSUED → PARTIALLY_PAID → PAID / VOID  
- JE: DRAFT → POSTED / VOID  

---

## 12. Control Pack (reglas que el esquema debe soportar)

| Control | Implicación de datos |
|---------|----------------------|
| 3-way / 2-way match | Tablas/campos qty/price ordered·received·invoiced + tolerancia + exception |
| Retenciones ISR/IVA | Líneas o breakdown tax_wh en vendor invoice |
| CFDI | Emisión en AR/Billing; UUID opcional en AP según política compañía |
| Dual payment | Campos preparer_id ≠ approver_id; status PENDING_DUAL |
| Credit hard block | customer.credit_* + eventos hold |
| Park/Post | status + posted_at + posted_by; reverse docs |
| Idempotency | tabla o UK de `idempotency_key` por operación crítica |
| Auditoría | todo cambio monetario / SoD / banco proveedor |

---

## 13. Esquemas ya existentes en el repo (punto de partida, incompletos)

Rutas:

- `database/flyway/{iam,catalog,workflow,document,audit,procurement,budget}/V1__init_mvp.sql`
- `database/schemas/core/iam.sql`
- `database/schemas/erp/purchasing.sql` (PR/PO/lines/GR — **muy básico**)
- `database/schemas/erp/accounting.sql` (**contiene `budget_item_id` legado → eliminar en ERP**)
- `database/schemas/grp/budget.sql` → **fuera del track ERP**

La IA debe **extender y corregir**, no asumir que el DDL actual está completo ni limpio de GRP.

---

## 14. UI carcasa ya construida (contexto de producto, no DDL)

En `feat-menu` / static IAM:

| Pantalla | Estado |
|----------|--------|
| Login 3 campos | Hecho |
| Shell + menú por permisos + dashboard | Hecho |
| Bandeja: pendientes / aprobadas / rechazadas + aprobar/rechazar/detalle | Hecho |
| Catálogos hub: 5 operativos editables + 3 SAT lectura | Hecho |
| Resto de módulos menú | Stub |

Esto valida UX; el modelo de datos debe anticipar la API real detrás de esas pantallas.

---

## 15. Dependencias entre servicios (sin FK cross-DB)

```text
iam, catalog, workflow, document, audit
        │
        ├── procurement ──► inventory (GoodsReceived)
        │         └──► ap (PO/GR refs)
        ├── inventory ◄── ar-billing (Delivery)
        ├── ap ──► treasury (PaymentProposal)
        ├── ar-billing ──► treasury (Receipts)
        ├── accounting ◄── ap / ar / treasury / inventory (postings)
        └── treasury ──► accounting (payments cleared)
```

Prohibido: flecha hacia `budget-service`.

---

## 16. Documentación fuente (leer si se necesita detalle de campos)

| Doc | Código | Contenido |
|-----|--------|-----------|
| `docs/erp/00-INDEX.md` | ERP-DOC-001 | Índice |
| `docs/erp/01-ERP-SCREEN-INVENTORY.md` | ERP-SI-001 | Pantallas |
| `docs/erp/02-ERP-FIELD-MATRIX.md` | ERP-FM-001 | Campos/validaciones por pantalla |
| `docs/erp/05-ERP-SCOPE-FREEZE-MVP.md` | ERP-SF-001 | Alcance congelado |
| `docs/erp/06-ERP-MVP-CONTROL-PACK.md` | ERP-CP-001 | Controles |
| `docs/erp/09-MAPA-SERVICIOS-ERP.md` | ERP-MS-001 | Servicios/BDs |
| `docs/erp/10-EVENTOS-ERP-MVP.md` | ERP-EV-001 | Eventos |
| `docs/erp/11-WORKFLOWS-ERP-MVP.md` | ERP-WF-001 | 6 flujos |
| `docs/erp/12-SOD-CASOS-PRUEBA.md` | ERP-SOD-001 | SoD |
| `docs/erp/13-CONFIG-SEED-ACME.md` | ERP-CFG-001 | Seed piloto |
| `docs/erp/14-DIAGRAMA-MICROSERVICIOS-FASES.md` | ERP-ARCH-DIAG-001 | Fases A/B |
| `docs/erp/15-CATALOGOS-CONFIGURABLES-ERP.md` | ERP-CAT-001 | Catálogos |
| `docs/adr/ADR-014-erp-sin-budget-grp.md` | ADR-014 | Sin budget |
| `docs/ddd/06-DOMAIN-PORTFOLIO-MAP.md` | DDD-PORT-001 | Bounded contexts |

OpenAPI: `shared/openapi/` (iam, catalog, workflow, document, audit, erp/*).

---

## 17. Prompt sugerido para la IA de datos (copiar/pegar)

```text
Eres arquitecto de datos PostgreSQL para un ERP microservicios (México, ADR-014 sin budget/GRP).

Usa el briefing ERP-DB-BRIEF-001 completo.

Entrega:
1) Una sección por BD (iam_db, catalog_db, workflow_db, document_db, audit_db,
   procurement_db, inventory_db, ap_db, ar_db, accounting_db, treasury_db).
2) En cada BD: lista de tablas, propósito, columnas clave, PK/UK, índices,
   checks de estado, y referencias lógicas a otras BDs (UUID, sin FK cross-db).
3) DDL PostgreSQL propuesto (puede ser por archivo Flyway V1 por servicio).
4) Tabla de eventos outbox sugerida (si aplica) por servicio productor.
5) Explicitamente lista lo que NO modelaste por estar OUT del Freeze.
6) Señala riesgos SoD / dual control / park-post / match / crédito / CFDI
   y cómo el esquema los soporta.
7) Elimina cualquier rastro de budget_item / allocation GRP.

No propongas monolito ni BD compartida entre dominios ERP.
```

---

## 18. Criterios de aceptación del diseño de BD

- [ ] 11 BDs lógicas alineadas a ERP-MS-001 (sin budget_db en el paquete ERP)
- [ ] Toda TX lleva `tenant_id` + `legal_entity_id` donde aplica
- [ ] Estados canónicos del Freeze, sin inventar máquinas paralelas
- [ ] Workflow unificado modelado; bandeja puede listar tasks cross-process
- [ ] Catálogos referencia ≠ maestros de negocio
- [ ] SAT como seed read-only
- [ ] Match 3-way/2-way + excepciones
- [ ] Dual control pago + SoD banco proveedor
- [ ] Crédito hard-block en cliente/SO
- [ ] Park/Post en JE/AP/pagos
- [ ] Idempotency en operaciones críticas
- [ ] Audit append-only
- [ ] Cero dependencia GRP/budget
- [ ] DDL revisable por servicio (Flyway-ready)

---

**Fin ERP-DB-BRIEF-001**

Este archivo es el **contexto único** recomendado para modular el esquema de BD del ERP. Si hay conflicto entre borradores SQL del repo y este briefing, **gana el Freeze + ADR-014 + este documento**.

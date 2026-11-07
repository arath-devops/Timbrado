# ERP Executive Gap Review
## ERP-XR-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-XR-001 |
| Entradas | ERP-SI-001 · ERP-FM-001 · DDD-PORT-001 |
| Panel | CFO · Controller · Director de Compras · Director Comercial · Director de RRHH · Director General |
| Benchmark | SAP S/4HANA · Oracle Fusion Cloud ERP · NetSuite |
| Estado | **Recomendaciones obligatorias pre-UI / pre-backend** |
| Rama | `feat-ERP` |

---

## 0. Veredicto ejecutivo (Director General)

El inventario y la matriz son un **buen mapa de cobertura funcional**, pero **no están listos para diseñar interfaz ni backend** sin cerrar gaps de control financiero, fiscal MX, crédito, matching, retención/impuestos, multi-compañía y segregación de funciones.

**Decisión recomendada:** congelar un **ERP MVP Control Pack** (campos y reglas de este documento) **antes** de wireframes o OpenAPI. Diseñar UI sobre la matriz actual reproduciría omisiones típicas que en SAP/Oracle/NetSuite son estándar desde el día 1.

| Semáforo | Área |
|----------|------|
| Rojo | AP sin tolerancia de match + retención; AR sin crédito; GL sin tipo de cambio / tasa; Pagos sin doble control |
| Ámbar | Compras sin Incoterms/condiciones entrega; Inventario sin cuentas de valuación completas; RRHH/Nómina subespecificados para MX |
| Verde | Shell IAM/WF/Docs/Audit; spine P2P básico; estructura de estados |

---

## 1. Lectura por rol

### 1.1 CFO

**Qué está bien:** Ciclo AP→Tesorería→GL y AR←Billing están esbozados; aging y posición de efectivo existen; tablero CFO en MVP.

**Gaps críticos:**
- No hay **control de liquidez comprometida** (pagos programados vs saldo banco / líneas de crédito).
- Falta **tipo de cambio / fecha TC** en documentos multi-moneda (estándar SAP BKPF-WAERS + KURSF; Fusion conversion rate; NetSuite exchange rate).
- No hay **centro de beneficio / segmento / proyecto** obligatorio en líneas P&L (reporting gerencial).
- Billing CFDI aparece como Pro/condicional: para operación MX debe ser **política explícita MVP o OUT documentado**.

**Riesgo financiero:** sobregiro operativo, P&L distorsionado por FX, cierres no confiables.

### 1.2 Controller

**Qué está bien:** Periodos OPEN/SOFT/HARD; asiento cuadrado; reconciliation account flag; soft-close concept.

**Gaps críticos:**
- Falta **journal source / document type** (SA/KG/RE… en SAP; Journal Category Fusion; Journal Type NetSuite).
- Falta **reversal reason + reversal period** estructurado.
- No hay **auto-reversing accruals** flag.
- No hay **tax determination engine fields** (tax jurisdiction, tax point date, recoverable flag).
- Match 3-way sin **tolerancias %/monto** ni **GR-based IV** vs **PO-based IV** (clave SAP).
- Subledger→GL: no se define **accounting event** ni **event class** (Fusion Subledger Accounting).

**Riesgo de auditoría / incumplimiento:** asientos no clasificables; diferencias de match forzadas sin política; IVA no recuperable mal contabilizado.

### 1.3 Director de Compras

**Qué está bien:** PR→PO→GR; vendor master; RFQ en Professional.

**Gaps críticos:**
- Faltan **Incoterms, lugar de entrega estructurado, freight terms, shipping method**.
- Falta **versión de precio / price unit** (precio por 1/100/1000 — SAP PEINH).
- Falta **account assignment category** en PR/PO (centro de costo vs proyecto vs activo vs stock) — estándar SAP/Fusion.
- Falta **confirmación de proveedor** (ASN / order acknowledgment).
- Falta **bloqueo de factura** a nivel PO (goods receipt non-valuated / invoice receipt flags).
- Evaluaciones y spend solo Enterprise: OK diferir, pero MVP necesita al menos **vendor hold reason**.

**Riesgo operativo:** OC incompletas, disputas de entrega, facturas sin asignación contable correcta.

### 1.4 Director Comercial

**Qué está bien:** SO→Delivery→Invoice; descuento con WF; ATP en Enterprise.

**Gaps críticos:**
- **Credit limit / credit block** ausente en Customer y en confirmación de SO (SAP credit management; Fusion credit check; NetSuite credit limit).
- Falta **salesperson / sales team / territory** (comisiones y accountability).
- Falta **shipping point / plant** (si hay multi-almacén).
- Falta **promise date vs customer request date** separados (ya hay requested_date; falta confirmed_date).
- Precios: sin **price origin** (list/manual/contract) ni **mínimo precio** (margin floor).
- RMA sin **disposition** (restock/scrap/repair).

**Riesgo financiero/operativo:** venta a clientes morosos; márgenes erosionados; devoluciones mal valuadas.

### 1.5 Director de RRHH

**Qué está bien:** Ficha empleado, ausencias, corrida y dispersión esbozadas.

**Gaps críticos vs NetSuite/Fusion HCM / SAP HCM light:**
- Falta **régimen fiscal / tipo contrato / jornada** (MX).
- Falta **IMSS/NSS, CURP, RFC empleado** como campos master (cumplimiento).
- Falta **sindicato / prestación / tabla de percepción-deducción** enlazada a incidencias.
- Finiquitos Enterprise: OK, pero **baja definitiva** debe existir al menos como estado+fecha en Professional.
- ESS sin **comprobante fiscal de nómina (CFDI nómina)** linkage.
- No hay **approver hierarchy** de vacaciones distinta del manager OU (substitutos).

**Riesgo de incumplimiento:** nómina MX no auditables ante IMSS/SAT si se implementa con la matriz actual.

### 1.6 Director General

**Qué está bien:** Separación de módulos alineada a suite moderna; pantallas compartidas de aprobación/docs/audit.

**Gaps de gobierno:**
- No hay **policy pack** (qué es obligatorio por país/compañía).
- No hay **SoD mínimo MVP** (quién crea vendor vs quién paga; quién crea asiento vs quién postea).
- Feature flags Enterprise: el DG necesita **mapa de módulos ON/OFF por compañía** desde Professional.
- Falta definición de **dueños de dato** (Data Owner) por maestro (Item, Vendor, Customer, Account).

**Riesgo:** implementar “todo el inventario” sin control pack → costo alto y controles débiles.

---

## 2. Campos faltantes (obligatorios a agregar antes de UI/backend)

Clasificación: **M = debe entrar al Freeze MVP ERP** · **P = Professional mínimo** · **E = Enterprise**.

### 2.1 Transversales / Platform

| Campo faltante | Dónde | Nivel | Por qué (benchmark) |
|----------------|-------|-------|---------------------|
| `company_code` / `legal_entity_id` explícito en todo documento | Todas transacciones | **M** | SAP BUKRS; Fusion LE; NetSuite subsidiary |
| `created_by` / `created_at` / `posted_by` / `posted_at` | Headers transaccionales | **M** | Audit trail operativo |
| `document_number` (folio fiscal/interno gapless policy) | PR/PO/AP/AR/SO/Journal | **M** | Numbering series NetSuite/Fusion |
| `external_ref` | Todos docs | **P** | Integraciones EDI/portal |
| `attachment_required` flag por status transition | WF | **P** | Gate de evidencia |

### 2.2 GL / Controller

| Campo faltante | Pantalla | Nivel | Benchmark |
|----------------|----------|-------|-----------|
| `journal_category` / `doc_type` | Asientos | **M** | SAP BLART; Fusion Journal Category |
| `exchange_rate` + `rate_date` + `rate_type` | Asientos, AP, AR, PO, SO | **M** | Obligatorio multi-moneda |
| `functional_currency_amount` | Líneas | **M** | Reporting compañía |
| `reversal_date` / `reversal_reason` | Asientos | **P** | Accrual reverse |
| `tax_point_date` | AP/AR | **P** | VAT/IVA timing |
| `ledger_id` (primary/secondary) | GL | **E** | Multi-ledger Fusion/SAP |

### 2.3 AP / Tesorería

| Campo faltante | Pantalla | Nivel | Benchmark |
|----------------|----------|-------|-----------|
| `match_tolerance_qty_pct` / `match_tolerance_amt` | Config + Match | **M** | SAP T169; Fusion tolerance |
| `invoice_receipt_flag` / `gr_based_invoice` | PO | **M** | Control de facturación |
| `withholding_tax_code` + `withholding_amount` | AP Invoice | **M** (MX) | Retenciones ISR/IVA |
| `payment_block` + `block_reason` | AP Invoice / Vendor | **M** | SAP zlsch/zterm blocks |
| `discount_date` / `cash_discount` | AP | **P** | Pronto pago |
| `payment_advice_number` | Pagos | **P** | Conciliación |
| `dual_control_approver_id` | Órdenes de pago | **M** | SoD tesorería |
| `bank_statement_line_id` | Conciliación | **P** | Auto-match |

### 2.4 AR / Comercial / Billing

| Campo faltante | Pantalla | Nivel | Benchmark |
|----------------|----------|-------|-----------|
| `credit_limit` | Customer | **M** | Credit mgmt |
| `credit_exposure` (calc) | Customer / SO | **M** | Open SO+AR |
| `credit_block` | SO confirm | **M** | Hard stop |
| `salesperson_id` | SO / Customer | **P** | Accountability |
| `confirmed_delivery_date` | SO | **P** | ATP confirm |
| `price_origin` | SO line | **P** | List/manual/contract |
| `min_margin_pct` check | SO | **P** | Margin floor |
| `payment_method_customer` | AR Receipt | **M** | Cash/transfer/card |
| `unapplied_cash` | Receipts | **P** | Cash on account |
| `fiscal_regime_customer` | Customer/Billing MX | **M** (MX) | CFDI |

### 2.5 Compras

| Campo faltante | Pantalla | Nivel | Benchmark |
|----------------|----------|-------|-----------|
| `account_assignment_category` | PR/PO line | **M** | K/P/A/F SAP |
| `cost_center_id` / `project_id` / `asset_id` | PR/PO line | **Cond. M** | Según assignment |
| `incoterms` + `incoterms_location` | PO | **P** | Comercio |
| `price_unit` | PO line | **P** | Precio por n unidades |
| `over_delivery_tolerance` / `under_delivery_tolerance` | PO line | **M** | GR control |
| `acknowledgment_status` | PO | **P** | Vendor confirm |
| `purchasing_org` / `purchasing_group` | PO | **P** | SAP EKORG/EKGRP |
| `hold_reason` | Vendor | **M** | Block con causa |

### 2.6 Inventario

| Campo faltante | Pantalla | Nivel | Benchmark |
|----------------|----------|-------|-----------|
| `qty_on_hand` / `qty_reserved` / `qty_available` | Existencias | **M** | ATP básico |
| `valuation_class` | Item | **P** | SAP |
| `negative_stock_allowed` | Warehouse/Item | **M** | Política |
| `standard_cost` / `moving_avg_cost` | Item | **M** | Costeo |
| `last_count_date` | Item/Warehouse | **P** | Cycle count |

### 2.7 RRHH / Nómina

| Campo faltante | Pantalla | Nivel | Benchmark |
|----------------|----------|-------|-----------|
| `rfc` / `curp` / `nss` | Empleado | **M** si Payroll IN | Cumplimiento MX |
| `contract_type` | Empleado | **M** si Payroll IN | — |
| `pay_group` / `pay_frequency` | Empleado | **M** | NetSuite/Fusion |
| `employer_register` (registro patronal) | Payroll params | **M** si MX | IMSS |
| `cfdi_payroll_uuid` | Payslip | **P** | Timbrado nómina |
| `substitute_approver_id` | Ausencias | **P** | Delegación |

---

## 3. Campos innecesarios o prematuros (diferir / no pintar en MVP)

| Campo / pantalla | Recomendación | Motivo |
|------------------|---------------|--------|
| SoD matrix completa en Roles (Enterprise fields en MVP admin) | Diferir UI Enterprise | Complejidad GRC; basta matriz simple + SoD mínimo documental |
| `attributes` JSON libre en catálogos | Restringir | Evita shadow schema; usar atributos tipados por catálogo |
| Hedge / debt / leasing fields | OUT MVP | Tesorería avanzada |
| WMS bins/waves/CPQ/MRP fields | OUT MVP | No son spine financiero |
| Portal proveedor/cliente campos | OUT MVP | Canal externo |
| Impersonación | Solo Dual-control admin | Riesgo seguridad si se abre pronto |
| Suscripciones billing | OUT salvo modelo negocio SaaS | — |
| `modules` claim UI feature flags ricos | Professional | MVP: hard config entorno |
| Evaluación avanzada de proveedores / spend BI | Professional+ | No bloquea P2P |

**Nota Director General:** “innecesario” ≠ borrar del inventario SI-001; significa **no diseñar ni API-ficar** hasta el nivel de producto correspondiente.

---

## 4. Riesgos operativos

| ID | Riesgo | Origen en SI/FM | Severidad | Mitigación obligatoria |
|----|--------|-----------------|-----------|------------------------|
| RO-01 | Over-receipt / under-delivery sin política | GR qty sin tolerancias PO | Alta | Campos tolerancia + hard/soft check |
| RO-02 | OC sin account assignment → AP no sabe a qué gastar | PO lines solo item/price | Alta | `account_assignment_category` + dims |
| RO-03 | Recepción a almacén incorrecto | warehouse condicional | Media | Obligatorio si item STOCK |
| RO-04 | Pedidos confirmados sin stock | ATP solo Enterprise | Alta | ATP light MVP o bloqueo soft + alerta |
| RO-05 | Devoluciones sin disposición | RMA incompleto | Media | disposition + valuación |
| RO-06 | Ausencias sin delegación | substitute ausente | Baja | Campo substitute Pro |
| RO-07 | Maestro vendor duplicado | solo tax_id format | Alta | Duplicate check legal_name+tax_id |

---

## 5. Riesgos financieros

| ID | Riesgo | Origen | Severidad | Mitigación obligatoria |
|----|--------|--------|-----------|------------------------|
| RF-01 | Doble pago de factura | unique vendor+invoice existe; falta payment block + dual control | **Crítica** | payment_block + dual_control + idempotency pago |
| RF-02 | Pago a proveedor bloqueado | hold_reason no en MVP vendor | **Crítica** | status BLOCKED enforce en Payment/PO |
| RF-03 | Venta sin cupo de crédito | credit_* ausente | **Crítica** | credit_limit + block en SO |
| RF-04 | FX no controlado | sin exchange_rate | Alta | rate+rate_date en docs multi-currency |
| RF-05 | Match forzado sin tolerancia | resolución libre | Alta | tolerancia + so_d override |
| RF-06 | Unapplied cash / sobraplicación AR | application ≤ saldo sí; falta unapplied | Media | allow unapplied + reporte |
| RF-07 | Costeo inventario inconsistente | costing parcial | Alta | standard/MA cost obligatorio si STOCK |
| RF-08 | Cierre con periodos abiertos en subledger | soft close no enlaza AP/AR | Alta | close checklist bloquea AP/AR/PO post |

---

## 6. Riesgos de auditoría

| ID | Riesgo | Origen | Severidad | Mitigación obligatoria |
|----|--------|--------|-----------|------------------------|
| RA-01 | No se sabe quién posteo vs quién creó | faltan posted_by/at | Alta | campos + audit event |
| RA-02 | REJECT sin evidencia | comment condicional OK; falta attachment gate | Media | policy attachment on reject/override |
| RA-03 | Override de match sin pista forense | MATCH_OVERRIDDEN existe; falta before/after amounts | Alta | snapshot variance en audit payload |
| RA-04 | Impersonación sin ticket | campo Ent | Crítica si se habilita | ticket_ref obligatorio + alert CFO |
| RA-05 | Cambios a bank account de vendor sin WF | bank_account editable | **Crítica** | WF VENDOR_BANK_CHANGE + dual control |
| RA-06 | Folios no gapless / no auditables | document_number no tipificado | Media | numbering policy por doc type |
| RA-07 | Master data sin data owner | no definido | Media | owner role por maestro |

---

## 7. Posibles incumplimientos

| Ámbito | Gap vs práctica SAP/Oracle/NetSuite + MX | Severidad | Acción |
|--------|------------------------------------------|-----------|--------|
| **CFDI / SAT** | Timbrado como Pro/condicional sin política de producto | Alta | Decisión formal: CFDI IN (MVP MX) u OUT explícito del ERP comercial |
| **Retenciones** | Sin withholding en AP | Alta | Campos withholding + cuentas GL |
| **IVA recuperable** | Sin tax recoverable flag / tax account split | Alta | Tax line accounting |
| **SOX / control interno** | Sin dual control de pagos ni SoD vendor-bank | Alta | Controles M arriba |
| **IMSS / nómina MX** | Empleado sin NSS/CURP/RFC; sin registro patronal | Alta si Payroll IN | Ampliar master o declarar Payroll OUT |
| **LGPD/privacidad** | Perfil sin consentimiento / retención | Media | Política de datos personales |
| **Multi-book / NIIF** | Un solo ledger implícito | Media | OK MVP; documentar limitación |
| **Contratos marco** | Solo Pro | Baja | OK diferir |

---

## 8. Comparativo sintético vs SAP / Oracle / NetSuite

| Capacidad de control | SAP S/4HANA | Oracle Fusion | NetSuite | Nuestro SI+FM hoy | Gap |
|----------------------|-------------|---------------|----------|-------------------|-----|
| Tolerancias GR/IV | Sí (T169) | Sí | Sí (pref) | Parcial (over tol mención) | **Cerrar MVP** |
| Credit management | Sí | Sí | Sí | No | **Cerrar MVP** |
| Withholding tax | Sí | Sí | Sí (tax engine) | No | **Cerrar MVP MX** |
| Dual control payments | Sí (configurable) | Sí | Aprobaciones | Débil | **Cerrar MVP** |
| Exchange rates on docs | Sí | Sí | Sí | No | **Cerrar MVP** |
| Account assignment on PR/PO | Sí | Sí (distro) | Sí (expense acct) | No | **Cerrar MVP** |
| Vendor bank change control | Sí | Sí | Workflow | No | **Cerrar MVP** |
| Subledger accounting events | Sí | Muy fuerte | Implícito | No modelado | **P** (diseño eventos) |
| Three-way match workbench | Sí | Sí | Sí | Pro | OK si PO flags MVP |
| ATP | Sí | Sí | Sí | Ent | **ATP light P/MVP** |
| CFDI nativo | Localiz. | Localiz. | Localiz./SuiteTax | Condicional | **Decisión país** |

---

## 9. Recomendaciones obligatorias (gate) — antes de UI o backend

### Gate A — Decisiones de producto (Director General + CFO)

1. **País/localización MVP:** ¿MX con CFDI+retenciones IN o ERP “core global” y fiscal OUT?  
2. **Payroll IN u OUT** del primer release ERP (si IN → campos IMSS/RFC/CURP obligatorios).  
3. **Multi-moneda IN u OUT** (si IN → exchange rate fields obligatorios en todos los docs).  
4. **Nivel de match:** 2-way vs 3-way por categoría de ítem (stock vs servicio).

### Gate B — Control Pack MVP (no negociable)

Agregar al Freeze / Field Matrix **antes** de diseño:

| # | Control | Campos / reglas mínimas |
|---|---------|-------------------------|
| 1 | Entidad legal en todo documento | `legal_entity_id` |
| 2 | Numeración | `document_number` + serie por tipo |
| 3 | Crédito cliente | `credit_limit`, `credit_block` en SO |
| 4 | Bloqueo proveedor/pago | `hold_reason`, `payment_block` |
| 5 | Dual control pagos | 2º aprobador ≠ solicitante |
| 6 | Cambio cuenta bancaria vendor | WF + auditoría before/after |
| 7 | Tolerancias PO/GR/AP | qty% y amount |
| 8 | Account assignment en PR/PO | category + CC/proyecto/activo/stock |
| 9 | FX | `currency`, `exchange_rate`, `rate_date` |
| 10 | Retenciones (si MX) | withholding code+amount |
| 11 | Posted by/at | separación create vs post |
| 12 | Unique vendor invoice | enforce DB+UI (ya en matriz; verificar DoR) |

### Gate C — Recortar alcance de diseño

- **No diseñar** WMS, MFG, TMS, CPQ, portales, hedges, consolidación IC en la primera UI.  
- **Sí diseñar** Object pages: Vendor, Customer, Item, PR, PO, GR, AP Invoice, Payment, SO, Delivery, AR Invoice, Receipt, Journal.  
- Inbox/Docs/Audit como **shell único** (no copias por módulo).

### Gate D — Modelo de control vs pantalla

- Toda transición de estado con impacto de dinero requiere: **permiso + (WF o dual control) + AuditFact + Idempotency-Key**.  
- Prohibido “guardar y postear” sin rol de posteo separado en GL/AP/AR (patrón SAP park/post; Fusion maker-checker).

### Gate E — Cumplimiento documental

Actualizar ERP-FM-001 con el Control Pack y emitir **ERP-SF-001 Scope Freeze ERP MVP** firmado por CFO + Controller + DG **antes** de:

- Wireframes / HTML preview  
- OpenAPI / eventos / Flyway de AP-AR-Billing-Treasury  

---

## 10. Campos a eliminar o marcar “no UI MVP” (limpieza)

| Acción | Ítem |
|--------|------|
| No UI MVP | JSON `attributes` libres; SoD matrix rica; feature flag studio |
| Mover a Config (no pantalla usuario) | match tolerances, numbering series, credit check on/off |
| Fusionar pantallas | “Lista + Detalle” AP no requieren campos distintos de captura; evitar triple mantenimiento de layouts |
| Evitar campo vanity | `priority` en PR sin SLA (o documentar que es informativo) |

---

## 11. Checklist de salida (Definition of Ready ejecutivo)

Antes de diseñar interfaz o backend, debe existir evidencia de:

- [x] Gates A documentados (localización, payroll, FX, match) → **ERP-SF-001 §2**  
- [ ] Gates A **firmados** DG+CFO+Controller  
- [x] Control Pack (Gate B) fusionado en ERP-FM-001 → **§19** + **ERP-CP-001**  
- [x] Lista de Object Pages MVP (Gate C) → **ERP-SF-001 §3–§4**  
- [x] Matriz SoD mínima Vendor vs AP vs Treasury vs GL poster → **ERP-SF-001 §5**  
- [x] Decisión CFDI / retenciones documentada → **ERP-SF-001 A2–A3**  
- [x] Explicit OUT list (WMS/MFG/…) → **ERP-SF-001 §4**  
- [ ] Umbrales numéricos piloto firmados por CFO → **ERP-CP-001 §3**  

**Si falta firma Gate A / umbrales → no iniciar OpenAPI productivo ni Angular.**

---

## 12. Conclusión del panel

| Rol | Posición |
|-----|----------|
| **CFO** | No autoriza backend financiero sin crédito, dual control de pagos y FX policy |
| **Controller** | No autoriza UI de GL/AP sin doc type, tolerancias, tax/withholding y park/post |
| **Dir. Compras** | No autoriza UI de OC sin account assignment y tolerancias de entrega |
| **Dir. Comercial** | No autoriza UI de pedidos sin credit block y origen de precio |
| **Dir. RRHH** | No autoriza nómina MX sin RFC/CURP/NSS; si no hay presupuesto, Payroll = OUT |
| **DG** | Congela Control Pack; recorta Enterprise del primer diseño; exige Freeze firmado |

---

**Documentos emitidos:** [ERP-SF-001](05-ERP-SCOPE-FREEZE-MVP.md) · [ERP-CP-001](06-ERP-MVP-CONTROL-PACK.md) · FM-001 §19.

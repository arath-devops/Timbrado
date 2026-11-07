# ERP MVP Control Pack
## ERP-CP-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-CP-001 |
| Título | Control Pack MVP — delta obligatorio pre-backend |
| Tipo | Field / Rules delta |
| Estado | **Normativo para Freeze** — `feat-ERP` |
| Origen | ERP-XR-001 Gate B |
| Destino | Fusionado en ERP-FM-001 §19 |
| Freeze | ERP-SF-001 |

---

## 1. Propósito

Definir el conjunto **mínimo no negociable** de campos y reglas de control financiero/operativo que deben existir en contratos (OpenAPI/DB/UI) del ERP MVP, aunque no estuvieran completos en ERP-FM-001 r0.

Sin este pack: **no** abrir OpenAPI ni Angular de AP/AR/GL/Treasury/SO.

---

## 2. Controles (12) — especificación

Formato alineado a FM: `Modulo | Pantalla | Campo | Obligatorio | Tipo | Regla | Validación`

### CP-01 Legal entity

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla de negocio | Validación |
|--------|----------|-------|------|------|------------------|------------|
| Transversal | Todo documento TX | legal_entity_id | Sí | Ref | Documento pertenece a una LE del tenant | Existe; usuario tiene scope |
| Transversal | Todo documento TX | company_code | Cond. | Text | Alias display de LE si se usa SAP-style | Único por tenant |

### CP-02 Numeración

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Transversal | PR/PO/GR/AP/AR/SO/Journal/Payment | document_number | Sí (al post/submit) | Text | Folio humano por serie+LE+tipo | Único; gapless policy por serie |
| Admin/Config | Numbering series | series_code, doc_type, legal_entity_id, next_value | Sí | — | Config no UI end-user | next_value atómico |

### CP-03 Crédito cliente

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Master | Ficha cliente | credit_limit | Sí | Money | Límite autorizado | ≥ 0 |
| Master | Ficha cliente | credit_block | Sí | Boolean | Bloqueo manual duro | — |
| Calculado | Cliente / SO | credit_exposure | Sí (calc) | Money | Open SO + open AR | Sistema |
| Ventas | Crear/Confirmar SO | credit_check_result | Sí | Enum | OK / HOLD / BLOCKED | BLOCKED⇒no CONFIRMED |
| Ventas | SO | credit_override_reason | Cond. | Text | Si APPR override HOLD | min 10 chars + WF |

### CP-04 Bloqueo proveedor / pago

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Compras | Ficha proveedor | hold_reason | Cond. | Text/Enum | Si status BLOCKED o payment hold | obligatorio al bloquear |
| CxP | Factura AP / Vendor | payment_block | Sí | Boolean | Impide incluir en propuesta pago | — |
| CxP | Factura AP | payment_block_reason | Cond. | Text | Si payment_block=true | min 5 chars |

### CP-05 Dual control pagos

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Tesorería | Orden de pago | maker_user_id | Sí | Ref | Quien crea/solicita | ≠ approver |
| Tesorería | Orden de pago | dual_control_approver_id | Cond. | Ref | Si amount ≥ threshold LE | ≠ maker; rol TRE2 |
| Tesorería | Orden de pago | dual_control_status | Sí | Enum | NOT_REQUIRED / PENDING / APPROVED | — |
| Config | Payment thresholds | dual_control_threshold | Sí | Money | Por LE/currency | > 0 |

### CP-06 Cambio cuenta bancaria vendor

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Compras | Ficha proveedor | bank_account | Sí | Text | Cuenta pago | mask display |
| Compras | Cambio banco | bank_change_request_id | Cond. | Ref | Todo cambio de banco vía solicitud | WF BANK_CHANGE |
| Audit | Vendor bank | before/after bank | Sí | JSON | Trail obligatorio | AuditFact |

### CP-07 Tolerancias match

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Config | Match policy | match_tolerance_qty_pct | Sí | Percent | Over-receipt / invoice qty | 0–100 |
| Config | Match policy | match_tolerance_amt | Sí | Money/% | Diff PO vs AP | ≥ 0 |
| CxP | Detalle AP | match_status | Sí | Enum | MATCHED / TOLERANCE / FAILED / NOT_REQUIRED | — |
| Compras | PO line | over_delivery_tolerance | Cond. | Percent | Default desde policy | ≥ 0 |
| Compras | PO line | under_delivery_tolerance | Cond. | Percent | Default desde policy | ≥ 0 |
| Compras | PO / Item | gr_based_invoice | Cond. | Boolean | True⇒exige GR antes AP | STOCK default true |

### CP-08 Account assignment

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Compras | PR/PO line | account_assignment_category | Sí | Enum | COST_CENTER / PROJECT / ASSET / STOCK | Enum cerrado |
| Compras | PR/PO line | cost_center_id | Cond. | Ref | Si category=COST_CENTER | Existe OU/CC |
| Compras | PR/PO line | project_id | Cond. | Ref | Si category=PROJECT | Existe (si Proyectos IN; else OUT category) |
| Compras | PR/PO line | asset_id | Cond. | Ref | Si category=ASSET | Existe |
| CxP | AP line | cost_center_id | Cond. | Ref | Hereda de PO o captura | Requerido si expense |

**Nota Freeze:** en release-1, categories habilitadas = **COST_CENTER** y **STOCK**. PROJECT/ASSET opcionales solo si stubs activados; default deshabilitar en config.

### CP-09 FX (multi-moneda light)

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Transversal | Docs con currency | currency | Sí | Enum | ISO-4217 | |
| Transversal | Docs | exchange_rate | Cond. | Number | Si currency ≠ LE functional | > 0 |
| Transversal | Docs | rate_date | Cond. | Date | Fecha tasa | ≤ posting_date |
| Transversal | Docs | rate_type | Cond. | Enum | SPOT / COMPANY / MANUAL | |
| Transversal | Líneas | functional_currency_amount | Cond. | Money | amount × rate | Calculado; audit si MANUAL |

### CP-10 Retenciones MX

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| CxP | Factura AP | withholding_tax_code | Cond. | Ref | Si vendor/servicio sujeto a retención | Catálogo TAX_WH |
| CxP | Factura AP | withholding_amount | Cond. | Money | Calculado o capturado | ≥ 0; ≤ subtotal |
| CxP | Factura AP | withholding_base | Cond. | Money | Base gravable | ≥ 0 |
| Master | Vendor | withholding_applicable | Sí | Boolean | Default retención | |

### CP-11 Posted by / at (park-post)

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Transversal | Journal/AP/AR/Payment/GR | created_by | Sí | Ref | Usuario creación | |
| Transversal | | created_at | Sí | DateTime | | |
| Transversal | | posted_by | Cond. | Ref | Al pasar a POSTED/ISSUED/SENT | Permiso post:* |
| Transversal | | posted_at | Cond. | DateTime | | ≥ created_at |
| GL/AP | UI acciones | action_park vs action_post | Sí | — | Botones separados | RBAC distinto |

### CP-12 Unique vendor invoice

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| CxP | Captura AP | vendor_id + invoice_number + legal_entity_id | Sí | — | Unicidad | Unique constraint DB+UI |

*(Ya estaba en FM; se eleva a Control Pack con LE en la clave.)*

---

## 3. Umbrales piloto ACME (propuesta config — ajustar en firma)

| Parámetro | Valor propuesto piloto |
|-----------|------------------------|
| dual_control_threshold (MXN) | 50,000 |
| PO_APPROVAL amount threshold | 200,000 |
| AP sin OC approval threshold | 100,000 |
| match_tolerance_qty_pct | 2% |
| match_tolerance_amt | 1% o $10 (menor) |
| credit_check | ON |
| gr_based_invoice default STOCK | true |
| gr_based_invoice default SERVICE | false |

---

## 4. Workflows adicionales mínimos

| Process code | Disparador |
|--------------|------------|
| PR_APPROVAL | PR submit |
| PO_APPROVAL | PO submit / amount |
| AP_INVOICE_APPROVAL | AP sin OC o over tolerance / amount |
| PAYMENT_DUAL_CONTROL | Payment ≥ threshold |
| BANK_CHANGE | Vendor bank update |
| CREDIT_OVERRIDE | SO credit HOLD override |

---

## 5. Checklist de fusión

- [x] Publicado ERP-CP-001  
- [x] Volcado en ERP-FM-001 §19  
- [x] Referenciado por ERP-SF-001  
- [ ] Umbrales §3 firmados por CFO  
- [ ] OpenAPI incluye propiedades CP-*  
- [ ] Flyway unique (vendor, invoice_number, legal_entity_id)  

---

**Fin ERP-CP-001**

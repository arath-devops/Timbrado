# Matriz de campos y reglas ERP
## ERP-FM-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-FM-001 |
| Título | Matriz funcional de campos, validaciones y reglas |
| Entrada | ERP-SI-001 (Inventario de pantallas) |
| Referentes | SAP S/4HANA · Oracle Fusion · NetSuite · Infor · Odoo Enterprise |
| Estado | Borrador funcional + **Paquete de control §19** — `feat-ERP` |
| Idioma | Español en reglas/validaciones; **nombres de campo en inglés** (identificadores API/BD) |
| Entregable | Matriz funcional (sin HTML / sin código de producto) |
| Complementos | ERP-CP-001 · ERP-SF-001 · ERP-XR-001 · [Glosario](07-GLOSARIO-ERP-DESARROLLO.md) |

---

## 0. Convenciones

### 0.1 Columnas de la matriz

| Columna | Significado |
|--------|-------------|
| Módulo | Dominio funcional |
| Pantalla | Nombre canónico ERP-SI-001 |
| Campo | Nombre de negocio del dato |
| Obligatorio | Sí / No / Condicional |
| Tipo | Text · Number · Money · Date · DateTime · Boolean · Enum · Ref · Email · File · Percent · Integer · JSON |
| Regla de negocio | Invariante de dominio (análogo SAP/Oracle/NetSuite/Infor/Odoo) |
| Validación | Regla de formato/rango/unicidad/existencia |

### 0.2 Metadatos por pantalla (antes de cada matriz)

Para cada pantalla se documenta además:

| Metadato | Contenido |
|----------|-----------|
| **Estados** | Ciclo de vida del registro |
| **Workflow** | Proceso de aprobación asociado (o N/A) |
| **Documentos** | Tipos de evidencia vinculados |
| **Auditoría** | Eventos que deben dejar trail |
| **Relaciones** | Entidades relacionadas (Refs) |

### 0.3 Obligatorio = Condicional

Significa “obligatorio si se cumple la condición” descrita en Regla/Validación.

### 0.4 Cobertura

- **§1–§12:** pantallas **MVP** con campos completos de captura/decisión.  
- **§13:** pantallas **Professional** (campos diferenciales).  
- **§14:** pantallas **Enterprise** (campos diferenciales).  
- Las pantallas tipo *lista/consulta* incluyen filtros y claves de fila; el detalle está en la pantalla de ficha/formulario.

---

# §1 Plataforma

## 1.1 Login / SSO

| Metadato | Valor |
|----------|-------|
| Estados | N/A (sesión) → Authenticated / Failed / Locked |
| Workflow | N/A |
| Documentos | N/A |
| Auditoría | LOGIN_SUCCESS, LOGIN_FAILED, LOCKOUT |
| Relaciones | User, Tenant/Company |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Login / SSO | tenant_or_company | Sí | Ref | Compañía activa del usuario (Fusion/NetSuite subsidiary) | Debe existir y estar ACTIVE |
| Plataforma | Login / SSO | username | Sí | Text | Identidad única por tenant | 3–100 chars; no vacío |
| Plataforma | Login / SSO | password | Condicional | Text | Obligatorio si no SSO | minLength política (≥8 MVP) |
| Plataforma | Login / SSO | sso_provider | Condicional | Enum | Si SSO habilitado | Valores allowlist |
| Plataforma | Login / SSO | mfa_code | Condicional | Text | Si MFA enrolled (Pro+) | OTP 6 dígitos / TOTP window |

## 1.2 Home / Launchpad

| Metadato | Valor |
|----------|-------|
| Estados | N/A |
| Workflow | N/A |
| Documentos | N/A |
| Auditoría | Opcional MENU_OPEN |
| Relaciones | Role → Apps |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Home / Launchpad | role_context | Sí | Ref | Apps filtradas por rol (Fiori catalogs) | Rol asignado al usuario |
| Plataforma | Home / Launchpad | company_context | Sí | Ref | Datos solo de compañía seleccionada | Membership válida |

## 1.3 Bandeja de aprobación (inbox)

| Metadato | Valor |
|----------|-------|
| Estados | tarea: OPEN → APPROVED / REJECTED / CANCELLED |
| Workflow | Genérico: CompleteTask(APPROVE\|REJECT) |
| Documentos | Link al expediente del business object |
| Auditoría | TASK_COMPLETED + comentario |
| Relaciones | WorkflowTask → PurchaseRequisition / PO / VendorInvoice / … |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Bandeja de aprobación | task_id | Sí | Ref | Solo tareas del assignee/rol | Existe y status=OPEN |
| Plataforma | Bandeja de aprobación | decision | Sí | Enum | APPROVE o REJECT | Enum cerrado |
| Plataforma | Bandeja de aprobación | comment | Condicional | Text | Obligatorio en REJECT (SAP/Odoo pattern) | min 5 chars si REJECT |
| Plataforma | Bandeja de aprobación | idempotency_key | Sí | Text | Evita doble decisión | Único por usuario+tarea |

## 1.4 Notificaciones

| Metadato | Valor |
|----------|-------|
| Estados | UNREAD / READ / ARCHIVED |
| Workflow | N/A |
| Documentos | N/A |
| Auditoría | Opcional |
| Relaciones | User, deep_link entity |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Notificaciones | notification_id | Sí | Ref | Solo del usuario sesión | Ownership |
| Plataforma | Notificaciones | mark_read | No | Boolean | Cambia UNREAD→READ | — |

## 1.5 Mi perfil

| Metadato | Valor |
|----------|-------|
| Estados | User ACTIVE/LOCKED (solo lectura aquí) |
| Workflow | N/A |
| Documentos | Avatar opcional |
| Auditoría | PROFILE_UPDATE, PASSWORD_CHANGE |
| Relaciones | User |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Mi perfil | display_name | Sí | Text | Nombre visible | 2–120 |
| Plataforma | Mi perfil | email | Sí | Email | Único en tenant | RFC email |
| Plataforma | Mi perfil | locale | No | Enum | es-MX / en-US… | Allowlist |
| Plataforma | Mi perfil | theme | No | Enum | light/dark | Allowlist |
| Plataforma | Mi perfil | new_password | Condicional | Text | Si cambia password | Política + confirm match |

## 1.6 Explorador de documentos / expediente

| Metadato | Valor |
|----------|-------|
| Estados | CaseFile OPEN / CLOSED |
| Workflow | N/A |
| Documentos | Lista de DocumentItem |
| Auditoría | CASE_VIEW (opcional) |
| Relaciones | business_ref (SC/OC/Invoice…) |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Explorador documentos | case_file_id | Sí | Ref | Un expediente por objeto de negocio | Existe |
| Plataforma | Explorador documentos | business_ref_type | Sí | Enum | Tipo agregado | Allowlist |
| Plataforma | Explorador documentos | business_ref_id | Sí | Text | Folio externo | No vacío |

## 1.7 Visor de documento

| Metadato | Valor |
|----------|-------|
| Estados | Document AVAILABLE / SUPERSEDED / DELETED |
| Workflow | N/A |
| Documentos | El propio archivo |
| Auditoría | DOCUMENT_DOWNLOAD |
| Relaciones | DocumentItem, CaseFile |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Visor de documento | document_id | Sí | Ref | Solo si permiso download | ACL |
| Plataforma | Visor de documento | version_no | No | Integer | Default = latest | ≥1 |

## 1.8 Subir evidencia

| Metadato | Valor |
|----------|-------|
| Estados | Upload → AVAILABLE |
| Workflow | N/A (puede desbloquear WF) |
| Documentos | Nuevo DocumentItem |
| Auditoría | DOCUMENT_UPLOADED |
| Relaciones | CaseFile, DocType catalog |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Subir evidencia | case_file_id | Sí | Ref | Destino del archivo | Existe OPEN |
| Plataforma | Subir evidencia | doc_type | Sí | Enum/Ref | Tipo catálogo DOC_TYPE | Activo |
| Plataforma | Subir evidencia | file | Sí | File | Binario en object storage | ≤20MB; mime allowlist |
| Plataforma | Subir evidencia | notes | No | Text | Comentario | ≤2000 |
| Plataforma | Subir evidencia | replaces_document_id | No | Ref | Nueva versión | Mismo case file |

## 1.9 Consulta de auditoría

| Metadato | Valor |
|----------|-------|
| Estados | N/A (inmutable) |
| Workflow | N/A |
| Documentos | N/A |
| Auditoría | Self-read opcional |
| Relaciones | entityType+entityId |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Consulta auditoría | entity_type | Sí | Text | Filtro obligatorio | Allowlist |
| Plataforma | Consulta auditoría | entity_id | Sí | Text | Folio | No vacío |
| Plataforma | Consulta auditoría | from_date | No | DateTime | Rango | ≤ to_date |
| Plataforma | Consulta auditoría | to_date | No | DateTime | Rango | ≥ from_date |

## 1.10 Administración de usuarios

| Metadato | Valor |
|----------|-------|
| Estados | ACTIVE / LOCKED / DISABLED |
| Workflow | Opcional aprobación alta (Pro) |
| Documentos | N/A |
| Auditoría | USER_CREATED, USER_UPDATED, USER_LOCKED |
| Relaciones | Roles, OrgUnit |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Administración usuarios | username | Sí | Text | Único por tenant | [a-z0-9._-]{3,64} |
| Plataforma | Administración usuarios | email | Sí | Email | Único | Email válido |
| Plataforma | Administración usuarios | full_name | Sí | Text | Identidad humana | 2–150 |
| Plataforma | Administración usuarios | status | Sí | Enum | ACTIVE default | Enum |
| Plataforma | Administración usuarios | org_unit_id | Sí | Ref | Scope organizacional | OU activa |
| Plataforma | Administración usuarios | role_codes | Sí | Ref[] | Al menos un rol | Roles existentes |
| Plataforma | Administración usuarios | temporary_password | Condicional | Text | Alta nueva | Política |

## 1.11 Roles y permisos

| Metadato | Valor |
|----------|-------|
| Estados | Role ACTIVE/INACTIVE |
| Workflow | N/A |
| Documentos | N/A |
| Auditoría | ROLE_UPDATED, PERMISSION_GRANTED |
| Relaciones | Permission catalog |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Roles y permisos | role_code | Sí | Text | Único inmutable tras uso | UPPER_SNAKE |
| Plataforma | Roles y permisos | role_name | Sí | Text | Etiqueta | 2–80 |
| Plataforma | Roles y permisos | permission_codes | Sí | Ref[] | RBAC (Fusion/Odoo) | Códigos válidos |
| Plataforma | Roles y permisos | so_d_conflicts | No | JSON | Enterprise: alertar SoD | Reglas GRC |

## 1.12 Estructura organizacional

| Metadato | Valor |
|----------|-------|
| Estados | OU ACTIVE/INACTIVE |
| Workflow | N/A |
| Documentos | N/A |
| Auditoría | OU_CREATED, OU_UPDATED |
| Relaciones | Parent OU, CostCenter |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Estructura organizacional | ou_code | Sí | Text | Único | 2–20 |
| Plataforma | Estructura organizacional | ou_name | Sí | Text | Nombre | 2–120 |
| Plataforma | Estructura organizacional | ou_type | Sí | Enum | COMPANY/DIVISION/DEPT/CC | Enum |
| Plataforma | Estructura organizacional | parent_ou_id | Condicional | Ref | Obligatorio si no root | Sin ciclos |
| Plataforma | Estructura organizacional | manager_user_id | No | Ref | Responsable | Usuario ACTIVE |

## 1.13 Catálogos maestros (hub)

| Metadato | Valor |
|----------|-------|
| Estados | Item ACTIVE/INACTIVE |
| Workflow | N/A (cambios maestros sensibles pueden ir a WF Pro) |
| Documentos | N/A |
| Auditoría | CATALOG_ITEM_UPSERTED |
| Relaciones | catalog_code |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Plataforma | Catálogos maestros | catalog_code | Sí | Enum | DOC_TYPE, UOM, TAX… | Allowlist |
| Plataforma | Catálogos maestros | item_code | Sí | Text | Único en catálogo | 1–40 |
| Plataforma | Catálogos maestros | item_name | Sí | Text | Etiqueta | 1–120 |
| Plataforma | Catálogos maestros | active | Sí | Boolean | Soft-delete | — |
| Plataforma | Catálogos maestros | attributes | No | JSON | Extensiones | Schema por catálogo |

---

# §2 Contabilidad general (GL)

## 2.1 Plan de cuentas

| Metadato | Valor |
|----------|-------|
| Estados | Account ACTIVE/INACTIVE |
| Workflow | N/A |
| Documentos | N/A |
| Auditoría | ACCOUNT_CREATED/UPDATED |
| Relaciones | AccountGroup, Company |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| GL | Plan de cuentas | account_code | Sí | Text | Único COA (SAP SKA1 / NetSuite Acct) | Patrón numérico/alfanum definido |
| GL | Plan de cuentas | account_name | Sí | Text | Nombre | 2–120 |
| GL | Plan de cuentas | account_type | Sí | Enum | ASSET/LIABILITY/EQUITY/REVENUE/EXPENSE | Enum |
| GL | Plan de cuentas | parent_account | No | Ref | Jerarquía | Mismo tipo o grupo |
| GL | Plan de cuentas | currency | Condicional | Enum | Si moneda extranjera | ISO 4217 |
| GL | Plan de cuentas | allow_manual_posting | Sí | Boolean | Cuentas de control = false | — |
| GL | Plan de cuentas | is_recon_account | No | Boolean | Para AP/AR subledger | — |

## 2.2 Periodos contables

| Metadato | Valor |
|----------|-------|
| Estados | OPEN / SOFT_CLOSE / HARD_CLOSE |
| Workflow | Aprobación cierre (Pro) |
| Documentos | N/A |
| Auditoría | PERIOD_OPENED/CLOSED |
| Relaciones | FiscalYear, Company |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| GL | Periodos contables | fiscal_year | Sí | Integer | Año fiscal | 2000–2100 |
| GL | Periodos contables | period_id | Sí | Text | YYYY-MM o 001–012 | Único por compañía |
| GL | Periodos contables | status | Sí | Enum | No postear si HARD_CLOSE | Enum |
| GL | Periodos contables | start_date | Sí | Date | Rango continuo | start < end |
| GL | Periodos contables | end_date | Sí | Date | Rango continuo | end > start |

## 2.3 Libro diario / asientos

| Metadato | Valor |
|----------|-------|
| Estados | DRAFT → POSTED → REVERSED |
| Workflow | Journal approval si monto > umbral (Pro) |
| Documentos | Soporte del asiento |
| Auditoría | JOURNAL_POSTED, JOURNAL_REVERSED |
| Relaciones | JournalLine → Account, CostCenter, Partner |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| GL | Libro diario / asientos | journal_date | Sí | Date | Fecha en periodo OPEN | Periodo abierto |
| GL | Libro diario / asientos | period_id | Sí | Ref | Derivado o manual | OPEN |
| GL | Libro diario / asientos | currency | Sí | Enum | Moneda compañía default | ISO |
| GL | Libro diario / asientos | header_text | Sí | Text | Concepto | 3–200 |
| GL | Libro diario / asientos | line_account | Sí | Ref | Cuenta posteable | allow_manual_posting |
| GL | Libro diario / asientos | line_debit | Condicional | Money | Debe o Haber, no ambos | ≥0; Debit XOR Credit |
| GL | Libro diario / asientos | line_credit | Condicional | Money | Debe o Haber, no ambos | ≥0; Debit XOR Credit |
| GL | Libro diario / asientos | line_cost_center | Condicional | Ref | Obligatorio si cuenta lo exige | OU/CC activo |
| GL | Libro diario / asientos | line_partner | No | Ref | Cliente/Proveedor | — |
| GL | Libro diario / asientos | balanced | Sí | Boolean | ΣDebit=ΣCredit (regla SAP/Oracle) | Abs(diff) < 0.01 |

## 2.4 Consulta mayor / Balanza / EEFF

| Metadato | Valor |
|----------|-------|
| Estados | N/A (consulta) |
| Workflow | N/A |
| Documentos | Export PDF/XLSX |
| Auditoría | REPORT_RUN (opcional) |
| Relaciones | Account, Period |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| GL | Consulta de cuenta / mayor | account_code | Sí | Ref | Filtro | Existe |
| GL | Consulta de cuenta / mayor | period_from | Sí | Ref | Rango | ≤ period_to |
| GL | Consulta de cuenta / mayor | period_to | Sí | Ref | Rango | ≥ period_from |
| GL | Balanza de comprobación | as_of_period | Sí | Ref | Periodo | Existe |
| GL | Estados financieros | statement_type | Sí | Enum | P&L / BS / CF | Enum |
| GL | Estados financieros | as_of_period | Sí | Ref | Periodo | Existe |

---

# §3 Cuentas por pagar (AP)

## 3.1 Lista / Detalle / Captura factura proveedor

| Metadato | Valor |
|----------|-------|
| Estados | DRAFT → PENDING_APPROVAL → POSTED → PARTIALLY_PAID → PAID → VOID |
| Workflow | AP_INVOICE_APPROVAL (si > umbral o sin OC) |
| Documentos | FACT (CFDI/PDF), OC, REC |
| Auditoría | AP_INVOICE_CREATED/POSTED/VOIDED |
| Relaciones | Vendor, PO, GR, Tax, Payment |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| AP | Captura factura proveedor | vendor_id | Sí | Ref | Proveedor no bloqueado | Status ACTIVE |
| AP | Captura factura proveedor | invoice_number | Sí | Text | Único por vendor (NetSuite/SAP) | 1–60; unique(vendor, number) |
| AP | Captura factura proveedor | invoice_date | Sí | Date | ≤ hoy+gracia | Fecha válida |
| AP | Captura factura proveedor | posting_date | Sí | Date | Periodo OPEN | Periodo abierto |
| AP | Captura factura proveedor | currency | Sí | Enum | = moneda OC si hay match | ISO |
| AP | Captura factura proveedor | po_id | Condicional | Ref | Obligatorio si política 2/3-way | PO APPROVED/RECEIVED |
| AP | Captura factura proveedor | gr_id | Condicional | Ref | 3-way match | GR de la PO |
| AP | Captura factura proveedor | line_item | Sí | Ref/Text | Ítem o descripción | No vacío |
| AP | Captura factura proveedor | line_qty | Condicional | Number | Servicios pueden qty=1 | >0 |
| AP | Captura factura proveedor | line_unit_price | Sí | Money | ≥0 | ≥0 |
| AP | Captura factura proveedor | line_tax_code | Sí | Ref | IVA/retenciones | Catálogo TAX |
| AP | Captura factura proveedor | subtotal | Sí | Money | Σ líneas | = suma |
| AP | Captura factura proveedor | tax_total | Sí | Money | Calculado | ≥0 |
| AP | Captura factura proveedor | grand_total | Sí | Money | Subtotal+tax-ret | >0 |
| AP | Captura factura proveedor | due_date | Sí | Date | payment terms | ≥ invoice_date |
| AP | Captura factura proveedor | cfdi_uuid | Condicional | Text | MX: CFDI requerido (Pro) | UUID v4 format |
| AP | Captura factura proveedor | match_status | No | Enum | NOT_REQUIRED/MATCHED/EXCEPTION | Sistema |

## 3.2 Programación de pagos / Aging AP

| Metadato | Valor |
|----------|-------|
| Estados | Proposal DRAFT → APPROVED → PAID |
| Workflow | PAYMENT_PROPOSAL_APPROVAL (Pro) |
| Documentos | Comprobante pago |
| Auditoría | PAYMENT_PROPOSAL_*, PAYMENT_EXECUTED |
| Relaciones | AP Invoice, BankAccount |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| AP | Programación de pagos | invoice_ids | Sí | Ref[] | Solo POSTED con saldo | Saldo >0 |
| AP | Programación de pagos | payment_date | Sí | Date | Fecha valor | Periodo tesorería abierto |
| AP | Programación de pagos | bank_account_id | Sí | Ref | Cuenta pagadora | ACTIVE |
| AP | Programación de pagos | payment_amount | Sí | Money | ≤ saldo factura | >0 y ≤ open_amount |
| AP | Programación de pagos | payment_method | Sí | Enum | TRANSFER/CHECK/CASH | Enum |
| AP | Antigüedad saldos AP | as_of_date | Sí | Date | Corte | ≤ hoy |
| AP | Antigüedad saldos AP | vendor_id | No | Ref | Filtro | — |
| AP | Consulta proveedor (saldo) | vendor_id | Sí | Ref | Posición | Existe |

## 3.3 3-way match / excepciones (Professional)

| Metadato | Valor |
|----------|-------|
| Estados | EXCEPTION → RESOLVED / FORCE_APPROVED |
| Workflow | MATCH_EXCEPTION_APPROVAL |
| Documentos | FACT, OC, GR |
| Auditoría | MATCH_OVERRIDDEN |
| Relaciones | PO-GR-Invoice |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| AP | 3-way match workbench | invoice_id | Sí | Ref | Con excepción | match_status=EXCEPTION |
| AP | 3-way match workbench | variance_qty | No | Number | Sistema | — |
| AP | 3-way match workbench | variance_price | No | Money | Sistema | — |
| AP | 3-way match workbench | resolution | Sí | Enum | ACCEPT_PRICE/SHORT_CLOSE/REJECT | Enum |
| AP | 3-way match workbench | comment | Sí | Text | Justifica override | ≥10 chars |

---

# §4 Cuentas por cobrar (AR) + Billing

## 4.1 Factura cliente / Billing

| Metadato | Valor |
|----------|-------|
| Estados | DRAFT → ISSUED/TIMBRADA → PARTIALLY_PAID → PAID → CANCELLED |
| Workflow | AR_CREDIT_APPROVAL para NC |
| Documentos | FACT cliente / CFDI |
| Auditoría | AR_INVOICE_ISSUED/CANCELLED |
| Relaciones | Customer, SalesOrder, Tax |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Billing | Emisión de factura | customer_id | Sí | Ref | Cliente ACTIVE | Existe |
| Billing | Emisión de factura | invoice_date | Sí | Date | Emisión | Periodo AR abierto |
| Billing | Emisión de factura | sales_order_id | Condicional | Ref | Si nace de pedido | SO Delivered/Ready |
| Billing | Emisión de factura | payment_terms | Sí | Ref | Condiciones | Catálogo |
| Billing | Emisión de factura | line_product | Sí | Ref | Ítem vendible | ACTIVE |
| Billing | Emisión de factura | line_qty | Sí | Number | >0 | >0 |
| Billing | Emisión de factura | line_price | Sí | Money | Lista precios o manual | ≥0 |
| Billing | Emisión de factura | tax_code | Sí | Ref | Impuesto | Catálogo |
| Billing | Emisión de factura | grand_total | Sí | Money | Calculado | >0 |
| Billing | Emisión de factura | cfdi_usage | Condicional | Enum | MX uso CFDI | Allowlist |
| Billing | Cancelación / crédito | reason_code | Sí | Enum | Motivo cancelación | Enum |
| Billing | Cancelación / crédito | related_uuid | Condicional | Text | Sustitución CFDI | UUID |

## 4.2 Cobros / Aging AR

| Metadato | Valor |
|----------|-------|
| Estados | Receipt DRAFT → POSTED / REVERSED |
| Workflow | N/A (umbral Pro) |
| Documentos | Comprobante depósito |
| Auditoría | AR_RECEIPT_POSTED |
| Relaciones | AR Invoice, Bank |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| AR | Registro de cobros | customer_id | Sí | Ref | Cliente | ACTIVE |
| AR | Registro de cobros | receipt_date | Sí | Date | Fecha cobro | Periodo abierto |
| AR | Registro de cobros | amount | Sí | Money | Total recibido | >0 |
| AR | Registro de cobros | bank_account_id | Sí | Ref | Cuenta depósito | ACTIVE |
| AR | Registro de cobros | application_invoice_id | Sí | Ref | Factura a aplicar | Saldo>0 mismo cliente |
| AR | Registro de cobros | application_amount | Sí | Money | ≤ saldo y ≤ receipt | >0 |
| AR | Antigüedad saldos AR | as_of_date | Sí | Date | Corte | ≤ hoy |
| AR | Estado de cuenta cliente | customer_id | Sí | Ref | Extracto | Existe |

---

# §5 Tesorería

## 5.1 Cuentas bancarias / Posición / Órdenes de pago / Conciliación

| Metadato | Valor |
|----------|-------|
| Estados | BankAccount ACTIVE/INACTIVE; Payment DRAFT→SENT→CLEARED/VOID; Rec OPEN→MATCHED |
| Workflow | PAYMENT_RELEASE (doble control Enterprise) |
| Documentos | Comprobante bancario, layout SPEI |
| Auditoría | BANK_ACCOUNT_*, PAYMENT_*, BANK_RECON_* |
| Relaciones | AP/AR/Payroll, GL cash account |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Tesorería | Cuentas bancarias | bank_name | Sí | Text | Banco | 2–80 |
| Tesorería | Cuentas bancarias | account_number | Sí | Text | Único en compañía | Enmascarar en UI |
| Tesorería | Cuentas bancarias | currency | Sí | Enum | Moneda cuenta | ISO |
| Tesorería | Cuentas bancarias | gl_cash_account | Sí | Ref | Cuenta mayor | Tipo ASSET |
| Tesorería | Posición de efectivo | as_of_datetime | Sí | DateTime | Corte | ≤ now |
| Tesorería | Órdenes de pago | source_type | Sí | Enum | AP/PAYROLL/OTHER | Enum |
| Tesorería | Órdenes de pago | source_id | Sí | Ref | Documento origen | Posteado |
| Tesorería | Órdenes de pago | payee_id | Sí | Ref | Beneficiario | Cuenta bancaria payee |
| Tesorería | Órdenes de pago | amount | Sí | Money | Exacto a propuesta | >0 |
| Tesorería | Órdenes de pago | execution_date | Sí | Date | Fecha valor | ≥ hoy-1 (gracia) |
| Tesorería | Conciliación bancaria | bank_account_id | Sí | Ref | Cuenta | ACTIVE |
| Tesorería | Conciliación bancaria | statement_date | Sí | Date | Extracto | — |
| Tesorería | Conciliación bancaria | statement_balance | Sí | Money | Saldo banco | — |
| Tesorería | Conciliación bancaria | matched_tx_ids | No | Ref[] | Match libro↔banco | Misma moneda/monto |

---

# §6 Compras (P2P)

## 6.1 Requisición

| Metadato | Valor |
|----------|-------|
| Estados | DRAFT → SUBMITTED → APPROVED / REJECTED → CANCELLED → CLOSED |
| Workflow | PR_APPROVAL (My Inbox) |
| Documentos | REQ, COT |
| Auditoría | PR_CREATED/SUBMITTED/APPROVED/REJECTED |
| Relaciones | Requester, OU, Item, Vendor(sugerido), Budget(ACL GOV) |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Compras | Nueva requisición | title | Sí | Text | Asunto | 5–200 |
| Compras | Nueva requisición | requester_id | Sí | Ref | Default sesión | ACTIVE |
| Compras | Nueva requisición | org_unit_id | Sí | Ref | OU del gasto | ACTIVE + OrgScope |
| Compras | Nueva requisición | need_by_date | No | Date | Fecha requerida | ≥ hoy |
| Compras | Nueva requisición | justification | Sí | Text | Motivo de compra (Odoo/Fusion) | ≥20 chars |
| Compras | Nueva requisición | priority | No | Enum | LOW/MED/HIGH | Enum |
| Compras | Nueva requisición | line_item_id | Condicional | Ref | Catálogo o free-text | Item ACTIVE o desc |
| Compras | Nueva requisición | line_description | Sí | Text | Descripción | 3–250 |
| Compras | Nueva requisición | line_qty | Sí | Number | >0 | >0 |
| Compras | Nueva requisición | line_uom | Sí | Ref | UoM | Catálogo |
| Compras | Nueva requisición | line_est_price | Sí | Money | Estimado | ≥0 |
| Compras | Nueva requisición | suggested_vendor_id | No | Ref | Hint | ACTIVE |
| Compras | Nueva requisición | total_amount | Sí | Money | Σ líneas | >0 para submit |
| Compras | Detalle requisición | status | Sí | Enum | Solo lectura | Máquina estados |
| Compras | Mis requisiciones | status_filter | No | Enum | Filtro lista | — |

## 6.2 Orden de compra

| Metadato | Valor |
|----------|-------|
| Estados | DRAFT → PENDING_APPROVAL → APPROVED → SENT → PARTIALLY_RECEIVED → RECEIVED → CLOSED / CANCELLED |
| Workflow | PO_APPROVAL |
| Documentos | OC firmada, COT |
| Auditoría | PO_* |
| Relaciones | Vendor, PR, Item, AP Invoice, GR |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Compras | Crear / editar OC | vendor_id | Sí | Ref | Proveedor aprobado | ACTIVE no blocked |
| Compras | Crear / editar OC | order_date | Sí | Date | Fecha OC | Periodo compras abierto |
| Compras | Crear / editar OC | currency | Sí | Enum | Moneda | ISO |
| Compras | Crear / editar OC | payment_terms | Sí | Ref | Condiciones | Catálogo |
| Compras | Crear / editar OC | delivery_address | Sí | Text | Lugar entrega | 5–250 |
| Compras | Crear / editar OC | pr_id | No | Ref | Origen | PR APPROVED |
| Compras | Crear / editar OC | line_item_id | Sí | Ref | Ítem | ACTIVE |
| Compras | Crear / editar OC | line_qty | Sí | Number | >0 | >0 |
| Compras | Crear / editar OC | line_price | Sí | Money | Precio negociado | ≥0 |
| Compras | Crear / editar OC | line_tax_code | Sí | Ref | Impuesto | Catálogo |
| Compras | Crear / editar OC | total_amount | Sí | Money | Calculado | >0 |
| Compras | Crear / editar OC | buyer_id | Sí | Ref | Comprador | Rol BUY |

## 6.3 Recepción

| Metadato | Valor |
|----------|-------|
| Estados | DRAFT → POSTED → CANCELLED |
| Workflow | N/A (o recepción ciega Pro) |
| Documentos | REC / packing slip |
| Auditoría | GR_POSTED |
| Relaciones | PO, Inventory move, AP match |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Compras | Recepción mercancías/servicios | po_id | Sí | Ref | OC APPROVED/SENT | Existe |
| Compras | Recepción mercancías/servicios | receipt_date | Sí | Date | Fecha recepción | ≤ hoy+1 |
| Compras | Recepción mercancías/servicios | warehouse_id | Condicional | Ref | Obligatorio si stockable | ACTIVE |
| Compras | Recepción mercancías/servicios | line_po_line_id | Sí | Ref | Línea OC | Open qty >0 |
| Compras | Recepción mercancías/servicios | line_qty_received | Sí | Number | ≤ open qty (salvo over-delivery tolerada) | >0; ≤ open*(1+tol) |
| Compras | Recepción mercancías/servicios | receipt_type | Sí | Enum | FULL/PARTIAL | Enum |

## 6.4 Proveedores

| Metadato | Valor |
|----------|-------|
| Estados | DRAFT → ACTIVE → BLOCKED |
| Workflow | VENDOR_ONBOARDING (Pro) |
| Documentos | Tax ID docs, contratos |
| Auditoría | VENDOR_* |
| Relaciones | Bank accounts, Terms, PO/AP |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Compras | Ficha de proveedor | vendor_code | Sí | Text | Único | 3–20 |
| Compras | Ficha de proveedor | legal_name | Sí | Text | Razón social | 3–200 |
| Compras | Ficha de proveedor | tax_id | Sí | Text | RFC/VAT (NetSuite/SAP) | Formato país |
| Compras | Ficha de proveedor | email | No | Email | Contacto | Email |
| Compras | Ficha de proveedor | payment_terms_default | Sí | Ref | Default AP | Catálogo |
| Compras | Ficha de proveedor | bank_account | Condicional | Text | Obligatorio para pago transfer | IBAN/CLABE len |
| Compras | Ficha de proveedor | currency | Sí | Enum | Moneda default | ISO |
| Compras | Ficha de proveedor | status | Sí | Enum | BLOCKED impide OC/AP | Enum |

---

# §7 Inventario

## 7.1 Artículos / Existencias / Movimientos

| Metadato | Valor |
|----------|-------|
| Estados | Item ACTIVE/INACTIVE; Move DRAFT→POSTED |
| Workflow | ADJUSTMENT_APPROVAL si |qty| > umbral |
| Documentos | Soporte ajuste |
| Auditoría | ITEM_*, INV_MOVE_POSTED |
| Relaciones | UoM, Warehouse, GL valuation, PO/SO |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Inventario | Maestro de artículos | item_code | Sí | Text | Único (SKU) | 1–40 |
| Inventario | Maestro de artículos | item_name | Sí | Text | Nombre | 2–120 |
| Inventario | Maestro de artículos | item_type | Sí | Enum | STOCK/SERVICE/NONSTOCK | Enum |
| Inventario | Maestro de artículos | uom | Sí | Ref | UoM base | Catálogo |
| Inventario | Maestro de artículos | costing_method | Condicional | Enum | FIFO/AVG/STD si STOCK | Enum |
| Inventario | Maestro de artículos | inventory_account | Condicional | Ref | Si STOCK | Cuenta GL |
| Inventario | Maestro de artículos | sales_price | No | Money | Default SO | ≥0 |
| Inventario | Maestro de artículos | purchase_price | No | Money | Default PO | ≥0 |
| Inventario | Consulta existencias | warehouse_id | No | Ref | Filtro | — |
| Inventario | Consulta existencias | item_id | No | Ref | Filtro | — |
| Inventario | Movimientos inventario | move_type | Sí | Enum | IN/OUT/TRANSFER/ADJUST | Enum |
| Inventario | Movimientos inventario | item_id | Sí | Ref | STOCK | ACTIVE stockable |
| Inventario | Movimientos inventario | qty | Sí | Number | ≠0 | ≠0 |
| Inventario | Movimientos inventario | warehouse_id | Sí | Ref | Origen | ACTIVE |
| Inventario | Movimientos inventario | warehouse_dest_id | Condicional | Ref | Si TRANSFER | ≠ origen |
| Inventario | Movimientos inventario | reason_code | Condicional | Enum | Obligatorio ADJUST | Enum |

---

# §8 Ventas (O2C)

## 8.1 Pedido / Entrega

| Metadato | Valor |
|----------|-------|
| Estados | SO: DRAFT→CONFIRMED→PARTIALLY_DELIVERED→DELIVERED→INVOICED→CLOSED/CANCELLED; Delivery POSTED |
| Workflow | SO_DISCOUNT_APPROVAL si descuento > X% |
| Documentos | Quote, SO, Delivery note |
| Auditoría | SO_*, DELIVERY_POSTED |
| Relaciones | Customer, Item, Inventory, Billing |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Ventas | Crear / editar pedido | customer_id | Sí | Ref | Cliente credit-check (Pro) | ACTIVE; credit ok |
| Ventas | Crear / editar pedido | order_date | Sí | Date | Fecha | — |
| Ventas | Crear / editar pedido | requested_date | No | Date | Promesa | ≥ order_date |
| Ventas | Crear / editar pedido | currency | Sí | Enum | Moneda | ISO |
| Ventas | Crear / editar pedido | price_list_id | No | Ref | Lista | ACTIVE |
| Ventas | Crear / editar pedido | line_item_id | Sí | Ref | Vendible | ACTIVE |
| Ventas | Crear / editar pedido | line_qty | Sí | Number | ATP check (Pro) | >0; ≤ ATP si enforced |
| Ventas | Crear / editar pedido | line_price | Sí | Money | ≥0 | ≥0 |
| Ventas | Crear / editar pedido | line_discount_pct | No | Percent | Si > umbral → WF | 0–100 |
| Ventas | Crear / editar pedido | total_amount | Sí | Money | Calculado | ≥0 |
| Ventas | Entregas / remisiones | sales_order_id | Sí | Ref | SO CONFIRMED+ | Open qty |
| Ventas | Entregas / remisiones | warehouse_id | Sí | Ref | Stock | ACTIVE |
| Ventas | Entregas / remisiones | line_qty_deliver | Sí | Number | ≤ open | >0 |
| Ventas | Entregas / remisiones | delivery_date | Sí | Date | Fecha | ≤ hoy+1 |

---

# §9 Activo fijo (Professional)

| Metadato | Valor |
|----------|-------|
| Estados | Asset DRAFT→CAPITALIZED→ACTIVE→DISPOSED |
| Workflow | ASSET_CAPITALIZATION_APPROVAL |
| Documentos | Factura capitalización, acta |
| Auditoría | ASSET_* |
| Relaciones | AP Invoice / PO, GL, Depreciation book |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Activo fijo | Alta de activo | asset_code | Sí | Text | Único | 3–30 |
| Activo fijo | Alta de activo | asset_name | Sí | Text | Descripción | 3–120 |
| Activo fijo | Alta de activo | capitalization_date | Sí | Date | Fecha alta | Periodo FA abierto |
| Activo fijo | Alta de activo | acquisition_cost | Sí | Money | Costo | >0 |
| Activo fijo | Alta de activo | useful_life_months | Sí | Integer | Vida útil | >0 |
| Activo fijo | Alta de activo | depreciation_method | Sí | Enum | SL/DB… | Enum |
| Activo fijo | Alta de activo | asset_account | Sí | Ref | GL | ASSET |
| Activo fijo | Alta de activo | accum_dep_account | Sí | Ref | GL | ASSET contra |
| Activo fijo | Alta de activo | expense_account | Sí | Ref | Gasto dep | EXPENSE |
| Activo fijo | Depreciación (corrida) | period_id | Sí | Ref | Periodo | OPEN |
| Activo fijo | Depreciación (corrida) | book_id | Sí | Ref | Libro fiscal/corp | Existe |

---

# §10 Proyectos / HR / Nómina (Professional — campos clave)

## 10.1 Proyecto

| Metadato | Valor |
|----------|-------|
| Estados | Project DRAFT→ACTIVE→ON_HOLD→CLOSED |
| Workflow | PROJECT_BUDGET_APPROVAL |
| Documentos | Charter, contracts |
| Auditoría | PROJECT_* |
| Relaciones | Customer, Timesheet, Billing, Cost |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Proyectos | Lista/Plan proyecto | project_code | Sí | Text | Único | 3–20 |
| Proyectos | Lista/Plan proyecto | project_name | Sí | Text | Nombre | 3–120 |
| Proyectos | Lista/Plan proyecto | customer_id | Condicional | Ref | Si billable | ACTIVE |
| Proyectos | Lista/Plan proyecto | start_date | Sí | Date | Inicio | ≤ end |
| Proyectos | Lista/Plan proyecto | end_date | No | Date | Fin | ≥ start |
| Proyectos | Lista/Plan proyecto | budget_amount | No | Money | Techo | ≥0 |
| Proyectos | Timesheets | project_id | Sí | Ref | ACTIVE | Existe |
| Proyectos | Timesheets | work_date | Sí | Date | Día laborable | ≤ hoy |
| Proyectos | Timesheets | hours | Sí | Number | >0 | 0.25–24 |
| Proyectos | Timesheets | task_id | No | Ref | WBS | — |

## 10.2 Empleado / Nómina

| Metadato | Valor |
|----------|-------|
| Estados | Employee HIRED/ACTIVE/TERMINATED; PayrollRun DRAFT→CALCULATED→APPROVED→PAID |
| Workflow | PAYROLL_APPROVAL |
| Documentos | Contrato, recibos |
| Auditoría | EMPLOYEE_*, PAYROLL_RUN_* |
| Relaciones | OU, Position, Bank, Treasury |

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| RRHH | Empleados ficha | employee_number | Sí | Text | Único | 3–20 |
| RRHH | Empleados ficha | full_name | Sí | Text | Legal | 3–150 |
| RRHH | Empleados ficha | hire_date | Sí | Date | Alta | — |
| RRHH | Empleados ficha | org_unit_id | Sí | Ref | Adscripción | ACTIVE |
| RRHH | Empleados ficha | position_id | Sí | Ref | Puesto | ACTIVE |
| RRHH | Empleados ficha | salary_base | Sí | Money | Compensación | ≥0 |
| RRHH | Empleados ficha | bank_clabe | Condicional | Text | Para dispersión | Len/checksum |
| RRHH | Ausencias | leave_type | Sí | Enum | VACATION/SICK… | Enum |
| RRHH | Ausencias | from_date | Sí | Date | Rango | ≤ to_date |
| RRHH | Ausencias | to_date | Sí | Date | Rango | ≥ from_date |
| Nómina | Corrida de nómina | pay_period | Sí | Ref | Periodo | OPEN |
| Nómina | Corrida de nómina | payroll_group | Sí | Ref | Grupo | Existe |
| Nómina | Corrida de nómina | run_date | Sí | Date | Cálculo | — |
| Nómina | Dispersión | payroll_run_id | Sí | Ref | APPROVED | Estado |
| Nómina | Dispersión | bank_account_id | Sí | Ref | Pagadora | ACTIVE |

---

# §11 CRM / Controlling / GRC (campos diferenciales)

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| CRM | Oportunidades | opportunity_name | Sí | Text | Nombre | 3–120 |
| CRM | Oportunidades | customer_id | Sí | Ref | Cuenta | ACTIVE |
| CRM | Oportunidades | stage | Sí | Enum | Pipeline | Enum ordenado |
| CRM | Oportunidades | expected_amount | Sí | Money | Forecast | ≥0 |
| CRM | Oportunidades | close_date | Sí | Date | Cierre esperado | — |
| CRM | Oportunidades | win_probability | No | Percent | 0–100 | 0–100 |
| Controlling | Presupuesto operativo | fiscal_year | Sí | Integer | Año | — |
| Controlling | Presupuesto operativo | cost_center_id | Sí | Ref | Dimensión | ACTIVE |
| Controlling | Presupuesto operativo | account_id | Sí | Ref | Cuenta gasto | EXPENSE |
| Controlling | Presupuesto operativo | amount | Sí | Money | Techo | ≥0 |
| Controlling | Tablero CFO | as_of_date | Sí | Date | Corte KPIs | ≤ hoy |
| GRC | SoD monitor | user_id | Sí | Ref | Sujeto | — |
| GRC | SoD monitor | conflict_rule_id | Sí | Ref | Regla | ACTIVE |
| GRC | SoD monitor | severity | Sí | Enum | LOW/MED/HIGH | Enum |

---

# §12 Pantallas lista MVP — filtros estándar

Aplican a: Lista OC, Lista facturas AP/AR, Lista pedidos, Lista asientos, etc.

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| * | *Lista* | date_from | No | Date | Rango | ≤ date_to |
| * | *Lista* | date_to | No | Date | Rango | ≥ date_from |
| * | *Lista* | status | No | Enum | Filtro estado | Enum del documento |
| * | *Lista* | search_text | No | Text | Folio/nombre | ≤100 |
| * | *Lista* | company_id | Sí | Ref | Contexto compañía | Session company |
| * | *Lista* | page_size | No | Integer | Paginación | 10–100 |

---

# §13 Professional — matrices diferenciales (resto de pantallas SI-001)

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Compras | RFQ | rfq_deadline | Sí | DateTime | Cierre cotización | > now |
| Compras | RFQ | vendor_ids | Sí | Ref[] | ≥2 invitados recomendado | ≥1 |
| Compras | Comparativo cotizaciones | awarded_vendor_id | Sí | Ref | Debe haber cotizado | En lista RFQ |
| Compras | Comparativo cotizaciones | award_reason | Sí | Text | Transparencia award | ≥10 |
| Compras | Contratos de compra | contract_start | Sí | Date | Vigencia | < end |
| Compras | Contratos de compra | contract_end | Sí | Date | Vigencia | > start |
| Compras | Contratos de compra | ceiling_amount | Sí | Money | Monto máximo | >0 |
| Compras | Catálogo compras | catalog_item_id | Sí | Ref | Punch-out/item | ACTIVE |
| Compras | Devolución proveedor | gr_id | Sí | Ref | Base devolución | POSTED |
| Compras | Devolución proveedor | qty_return | Sí | Number | ≤ recibido neto | >0 |
| AP | Notas de crédito proveedor | original_invoice_id | Sí | Ref | Factura origen | POSTED |
| AP | Notas de crédito proveedor | credit_amount | Sí | Money | ≤ open/total | >0 |
| AR | Notas de crédito cliente | original_invoice_id | Sí | Ref | Factura origen | ISSUED |
| AR | Cobranza | promise_date | Sí | Date | Promesa pago | ≥ hoy |
| AR | Cobranza | promise_amount | Sí | Money | Compromiso | >0 |
| Billing | Series / timbrado | series_code | Sí | Text | Serie fiscal | Único |
| Billing | Series / timbrado | certificate_id | Sí | Ref | Certificado vigente | Not expired |
| Tesorería | Transferencias internas | from_bank_id | Sí | Ref | Origen | ≠ to |
| Tesorería | Transferencias internas | to_bank_id | Sí | Ref | Destino | ≠ from |
| Tesorería | Transferencias internas | amount | Sí | Money | Traspaso | >0 |
| Tesorería | Cash forecast | horizon_days | Sí | Integer | Horizonte | 7–365 |
| Inventario | Transferencias almacén | qty | Sí | Number | Traspaso | >0; ≤ stock |
| Inventario | Conteo cíclico | counted_qty | Sí | Number | Físico | ≥0 |
| Inventario | Conteo cíclico | system_qty | Sí | Number | Snapshot | Sistema |
| Inventario | Valuación | costing_method | Sí | Enum | Método | Enum |
| Ventas | Cotizaciones | valid_until | Sí | Date | Vigencia quote | ≥ hoy |
| Ventas | Lista de precios | item_id | Sí | Ref | Precio | ACTIVE |
| Ventas | Lista de precios | unit_price | Sí | Money | Precio | ≥0 |
| Ventas | Devoluciones cliente | delivery_id | Sí | Ref | Origen | POSTED |
| Plataforma | Búsqueda global | query | Sí | Text | Texto | 2–100 |
| Plataforma | Definiciones workflow | process_key | Sí | Text | PO_APPROVAL… | Único |
| Plataforma | Definiciones workflow | steps_json | Sí | JSON | Definición | Schema WF |
| CRM | Leads | lead_source | No | Enum | Origen | Enum |
| CRM | Cuentas / contactos | account_name | Sí | Text | Cuenta | 2–120 |
| CRM | Actividades | activity_type | Sí | Enum | CALL/EMAIL/MEET | Enum |
| CRM | Actividades | due_date | No | DateTime | Vencimiento | — |

**Metadatos Professional (resumen):**  
RFQ/Award → WF `SOURCING_AWARD`; Contratos → estados ACTIVE/EXPIRED; NC AP/AR → WF crédito; Conteo → ADJUSTMENT_APPROVAL si varía; Quotes → estados DRAFT/SENT/ACCEPTED/EXPIRED; Docs: COT, CONTRACT, CREDIT_NOTE; Auditoría: `*_AWARDED`, `CREDIT_POSTED`, `COUNT_POSTED`, `PRICE_LIST_UPDATED`.

---

# §14 Enterprise — matrices diferenciales

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| WMS | Ubicaciones bins | bin_code | Sí | Text | Único por warehouse | 1–20 |
| WMS | Put-away / picking | lp_n_or_hu | No | Text | Handling unit | — |
| WMS | Put-away / picking | from_bin | Sí | Ref | Origen | Stock disponible |
| WMS | Put-away / picking | to_bin | Sí | Ref | Destino | Capacidad |
| WMS | Wave management | wave_id | Sí | Ref | Oleada | OPEN |
| Manufactura | BOM | parent_item_id | Sí | Ref | Padre | MANUFACTURED |
| Manufactura | BOM | component_item_id | Sí | Ref | Componente | ≠ parent |
| Manufactura | BOM | component_qty | Sí | Number | Cantidad | >0 |
| Manufactura | Orden producción | bom_id | Sí | Ref | Versión BOM | ACTIVE |
| Manufactura | Orden producción | qty_to_produce | Sí | Number | Orden | >0 |
| Manufactura | Orden producción | start_date | Sí | Date | Programa | ≤ finish |
| Manufactura | MRP | planning_horizon | Sí | Integer | Días | ≥1 |
| Manufactura | Calidad inspección | inspection_lot_id | Sí | Ref | Lote | OPEN |
| Manufactura | Calidad inspección | result | Sí | Enum | PASS/FAIL | Enum |
| TMS | Embarques | carrier_id | Sí | Ref | Transportista | ACTIVE |
| TMS | Embarques | delivery_ids | Sí | Ref[] | Entregas | POSTED |
| TMS | Landed cost | shipment_id | Sí | Ref | Viaje | — |
| TMS | Landed cost | landed_amount | Sí | Money | Prorrateo | ≥0 |
| Ventas | ATP / promesa | item_id | Sí | Ref | Consulta | — |
| Ventas | ATP / promesa | requested_qty | Sí | Number | Demanda | >0 |
| Ventas | Acuerdos de venta | agreement_ceiling | Sí | Money | Tope | >0 |
| CRM | CPQ | configuration_json | Sí | JSON | Config válida | Schema producto |
| CRM | Campañas | campaign_code | Sí | Text | Único | — |
| CRM | Casos servicio | case_priority | Sí | Enum | SLA | Enum |
| GL | Multi-compañía IC | trading_partner_co | Sí | Ref | IC | ≠ current |
| GL | Consolidación | consolidation_group | Sí | Ref | Grupo | — |
| Tesorería | Hedges | instrument_type | Sí | Enum | FX/IR | Enum |
| FA | Leasing | lease_liability | Sí | Money | IFRS16 | ≥0 |
| AP | Portal proveedor | vendor_user_id | Sí | Ref | Identidad externa | — |
| AR | Portal cliente | customer_user_id | Sí | Ref | Identidad externa | — |
| GRC | Certificación accesos | campaign_id | Sí | Ref | Campaña | OPEN |
| GRC | Certificación accesos | decision | Sí | Enum | KEEP/REVOKE | Enum |
| Plataforma | Feature flags | module_code | Sí | Enum | Módulo suite | Allowlist |
| Plataforma | Feature flags | enabled | Sí | Boolean | On/off tenant | — |
| Plataforma | Impersonación | target_user_id | Sí | Ref | Break-glass | Ticket obligatorio |
| Plataforma | Impersonación | ticket_ref | Sí | Text | Justificación | ≥5 |
| Nómina | Finiquitos | termination_date | Sí | Date | Baja | — |
| Nómina | Finiquitos | settlement_amount | Sí | Money | Calculado+ajustes | ≥0 |
| Proyectos | Staffing | role_needed | Sí | Text | Rol | — |
| Proyectos | Staffing | hours_allocated | Sí | Number | Capacidad | >0 |
| Inventario | Lotes / series | lot_or_serial | Sí | Text | Trazabilidad | Único serial |
| Billing | Suscripciones | billing_frequency | Sí | Enum | MONTHLY… | Enum |
| Billing | Suscripciones | next_bill_date | Sí | Date | Ciclo | ≥ hoy |

**Metadatos Enterprise (resumen):**  
MFG order states PLANNED→RELEASED→IN_PROGRESS→DONE; WMS tasks OPEN→DONE; Inspection PASS/FAIL bloquea GR; Portales = identidad distinta a IAM interno; Impersonación siempre auditada `IMPERSONATION_START/END`; SoD conflictos severity HIGH bloquean asignación de roles.

---

# §15 Matriz transversal — Workflow / Estados / Documentos / Auditoría (todas las pantallas SI)

| Pantalla (ERP-SI) | Workflow asociado | Estados del registro | Documentos asociados | Auditoría requerida |
|-------------------|--------------------|----------------------|----------------------|---------------------|
| Login / SSO | N/A | Auth OK/Fail/Lock | — | LOGIN_* |
| Home / Launchpad | N/A | N/A | — | opcional |
| Búsqueda global | N/A | N/A | — | SEARCH_QUERY opcional |
| Bandeja aprobación | CompleteTask | OPEN/APPROVED/REJECTED | Link expediente | TASK_COMPLETED |
| Notificaciones | N/A | UNREAD/READ | — | opcional |
| Mi perfil | N/A | User status | Avatar | PROFILE_* |
| Favoritos | N/A | N/A | — | no |
| Explorador docs | N/A | Case OPEN/CLOSED | Todos | CASE_VIEW opcional |
| Visor | N/A | AVAILABLE/… | PDF/XML | DOCUMENT_DOWNLOAD |
| Subir evidencia | N/A | →AVAILABLE | File | DOCUMENT_UPLOADED |
| Consulta auditoría | N/A | inmutable | — | AUDIT_READ |
| Admin usuarios | opcional | ACTIVE/LOCKED/DISABLED | — | USER_* |
| Roles y permisos | N/A | ACTIVE/INACTIVE | — | ROLE_*/PERM_* |
| Estructura org | N/A | ACTIVE/INACTIVE | — | OU_* |
| Catálogos | opcional Pro | ACTIVE/INACTIVE | — | CATALOG_* |
| Definiciones WF | N/A | DRAFT/PUBLISHED | — | WF_DEF_* |
| Feature flags | N/A | on/off | — | MODULE_FLAG_* |
| Impersonación | N/A | sesión soporte | ticket | IMPERSONATION_* |
| Plan cuentas | N/A | ACTIVE/INACTIVE | — | ACCOUNT_* |
| Periodos | Close approval Pro | OPEN/SOFT/HARD | — | PERIOD_* |
| Asientos | Journal approval Pro | DRAFT/POSTED/REVERSED | soporte | JOURNAL_* |
| Mayor/Balanza/EEFF | N/A | N/A | export | REPORT_RUN |
| Dimensiones CO | N/A | ACTIVE | — | CC_* |
| Asientos recurrentes | N/A | ACTIVE | — | RECUR_* |
| Multi-compañía/Consol | approval Ent | — | — | IC_*/CONS_* |
| Cierre asistido | checklist | OPEN→CLOSED | — | CLOSE_* |
| Tax returns | N/A | DRAFT/FILED | tax forms | TAX_RETURN_* |
| Controlling CO | N/A | — | — | CO_* |
| Lista/Captura/Detalle AP | AP_INVOICE_APPROVAL | DRAFT…PAID/VOID | FACT,OC,REC | AP_INVOICE_* |
| 3-way match | MATCH_EXCEPTION | EXCEPTION/RESOLVED | FACT,OC,GR | MATCH_* |
| Prog. pagos | PAYMENT_PROPOSAL | DRAFT→PAID | pay proof | PAYMENT_* |
| NC proveedor | CREDIT_APPROVAL | — | CREDIT | AP_CREDIT_* |
| Aging/Saldo vendor | N/A | N/A | — | opcional |
| Portal proveedor | N/A | — | — | VENDOR_PORTAL_* |
| Emisión factura AR | N/A/discount WF | DRAFT→ISSUED→PAID | CFDI | AR_INVOICE_* |
| Cobros | N/A | POSTED | depósito | AR_RECEIPT_* |
| NC cliente | AR_CREDIT_APPROVAL | — | CREDIT | AR_CREDIT_* |
| Aging/Edo cta | N/A | N/A | — | opcional |
| Cobranza/Dunning | N/A | — | letters | COLLECTION_* |
| Portal cliente | N/A | — | — | CUST_PORTAL_* |
| Series timbrado | N/A | ACTIVE | certs | SERIES_* |
| Facturación proyecto | milestone approval | — | — | PROJ_BILL_* |
| Suscripciones | N/A | ACTIVE/PAUSED | — | SUB_* |
| Bancos/Posición | N/A | ACTIVE | — | BANK_* |
| Órdenes pago | PAYMENT_RELEASE Ent | DRAFT→CLEARED | layout | PAYMENT_* |
| Conciliación | N/A | OPEN/MATCHED | statement | RECON_* |
| Transferencias | N/A | POSTED | — | TRANSFER_* |
| Cash forecast | N/A | N/A | — | opcional |
| Hedges/Deuda | treasury approval | — | — | TREAS_INST_* |
| Alta activo/Dep/Baja | ASSET_CAP_* | CAPITALIZED… | factura/acta | ASSET_* |
| Leasing | N/A | — | contrato | LEASE_* |
| Reqiciones/OC/Recepción | PR/PO_APPROVAL | ver §6 | REQ,COT,OC,REC | PR_*/PO_*/GR_* |
| RFQ/Comparativo/Contratos | SOURCING_AWARD | — | COT,CONTRACT | RFQ_*/AWARD_* |
| Catálogo compras | N/A | — | — | CAT_BUY_* |
| Eval proveedores | N/A | — | — | VENDOR_SCORE_* |
| Spend analysis | N/A | N/A | — | REPORT |
| Service entry | SES_APPROVAL | — | SES | SES_* |
| Proveedores ficha | VENDOR_ONBOARDING | DRAFT/ACTIVE/BLOCKED | tax docs | VENDOR_* |
| Items/Stock/Moves | ADJUSTMENT_APPROVAL | — | ajuste | ITEM_*/INV_* |
| Transfer/Conteo/Valuación | count WF | — | count sheet | COUNT_*/VAL_* |
| Lotes/series | N/A | — | — | LOT_* |
| WMS bins/pick/wave/pack/mobile | N/A/task | OPEN/DONE | — | WMS_* |
| Pedidos/Entregas | SO_DISCOUNT_APPROVAL | ver §8 | SO,DN | SO_*/DLV_* |
| Quotes/Precios/RMA/Acuerdos/ATP | quote WF | — | QUOTE | QUOTE_*/PRICE_*/RMA_* |
| Sales analytics | N/A | N/A | — | REPORT |
| CRM leads/opp/accounts/activities | N/A | pipeline stages | — | CRM_* |
| Campañas/Casos/CPQ | N/A | — | — | CRM_* |
| BOM/Routing/MO/MRP/QM/PM | MO release | MFG states | — | MFG_*/QM_* |
| TMS ship/track/landed | N/A | — | BOL | TMS_* |
| Proyectos/WBS/Cost/TS/Bill/Staff | PROJECT_BUDGET | DRAFT…CLOSED | charter | PROJECT_* |
| Empleados/Mov/Org/Leave/ESS | HR_MOVEMENT | HIRED… | contrato | EMPLOYEE_* |
| ATS/Talent/Benefits | N/A | — | — | HR_* |
| Nómina params/incidencias/run/payslip/pay | PAYROLL_APPROVAL | DRAFT…PAID | recibos | PAYROLL_* |
| Finiquitos/Reportes patronales | N/A | — | — | TERM_*/TAX_EMP_* |
| Presupuesto op/Forecast/Margen/CFO dash/Close dash | BUDGET_OP_APPROVAL | — | — | PLAN_*/KPI_* |
| SoD/Access cert/Controls/Policies | N/A | OPEN/CLOSED | evidence | GRC_* |
| Reportes/Diseñador/Tableros/Export | N/A | N/A | export | REPORT_*/EXPORT_* |

---

# §16 Relaciones maestro (diagrama lógico)

```text
Company
 ├─ User / Role / OU
 ├─ Vendor ── PO ── GR ── AP Invoice ── Payment Proposal ── Bank Payment ── GL
 ├─ Customer ── SO ── Delivery ── AR Invoice ── Receipt ── Bank ── GL
 ├─ Item ── Stock ── (GR/Delivery/MO)
 ├─ Asset ── Depreciation ── GL
 ├─ Employee ── PayrollRun ── Bank Payment ── GL
 └─ Project ── Timesheet / Cost / Project Invoice ── AR
```

---

# §17 Riesgos si se omiten campos críticos

| Campo omitido | Impacto |
|---------------|---------|
| `vendor_id` + `invoice_number` únicos | Doble captura de factura (riesgo #1 AP SAP/Oracle) |
| Periodo OPEN en posteos | Contabilidad en periodo cerrado |
| `balanced` en asientos | Libro descuadrado |
| `line_qty_received` vs open PO | Over-receipt silencioso |
| `application_amount` ≤ saldo AR/AP | Aplicaciones negativas / sobropago |
| `tax_id` proveedor/cliente | Incumplimiento fiscal |
| `comment` en REJECT | Decisiones no defendibles |
| `cfdi_uuid` (MX Pro+) | Facturación no válida ante autoridad |
| ATP/`qty` sin stock | Quiebre de inventario |
| `idempotency_key` en WF/pagos | Doble aprobación / doble pago |

---

# §18 Próximo paso

1. ~~Congelar subset MVP~~ → ver **ERP-SF-001**.  
2. Derivar OpenAPI `properties` + enums de estado **solo tras firma** de ERP-SF-001.  
3. HTML preview (`erp-preview/`) es UX spec; no sustituye esta matriz ni el Freeze.

---

# §19 Paquete de control MVP (fusionado desde ERP-CP-001 / ERP-XR-001)

Normativo para el release-1. Campos **adicionales o reforzados** respecto a §1–§14.  
Detalle narrativo en español: [Paquete de control](06-ERP-MVP-CONTROL-PACK.md) (ERP-CP-001).

## 19.1 Transversal — todos los documentos transaccionales

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Transversal | Headers TX | legal_entity_id | Sí | Ref | Documento anclado a LE | Scope usuario |
| Transversal | Headers TX | document_number | Sí (al submit/post) | Text | Folio serie+LE+tipo | Único |
| Transversal | Headers TX | created_by | Sí | Ref | Autor creación | — |
| Transversal | Headers TX | created_at | Sí | DateTime | — | — |
| Transversal | Headers TX | posted_by | Condicional | Ref | Al POSTED/ISSUED/SENT | Permiso post |
| Transversal | Headers TX | posted_at | Condicional | DateTime | — | ≥ created_at |
| Transversal | Docs multi-moneda | exchange_rate | Condicional | Number | Si currency ≠ functional LE | > 0 |
| Transversal | Docs multi-moneda | rate_date | Condicional | Date | Fecha de tasa | ≤ posting_date |
| Transversal | Docs multi-moneda | rate_type | Condicional | Enum | SPOT/COMPANY/MANUAL | Enum |
| Transversal | Líneas FX | functional_currency_amount | Condicional | Money | amount × rate | Calculado |

## 19.2 Cliente / Ventas — crédito

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Master | Ficha cliente | credit_limit | Sí | Money | Límite autorizado | ≥ 0 |
| Master | Ficha cliente | credit_block | Sí | Boolean | Bloqueo duro | — |
| Master/SO | Cliente / SO | credit_exposure | Sí (calc) | Money | Open SO + open AR | Sistema |
| Ventas | Crear/Confirmar SO | credit_check_result | Sí | Enum | OK/HOLD/BLOCKED | BLOCKED⇒no confirm |
| Ventas | SO | credit_override_reason | Condicional | Text | Override HOLD | ≥10 + WF |

## 19.3 Proveedor / CxP — hold, match, retenciones, unicidad

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Compras | Ficha proveedor | hold_reason | Condicional | Text | Si BLOCKED/hold | Obl. al bloquear |
| CxP | Factura AP | payment_block | Sí | Boolean | Fuera de propuesta pago | — |
| CxP | Factura AP | payment_block_reason | Condicional | Text | Si block=true | ≥5 |
| CxP | Factura AP | withholding_tax_code | Condicional | Ref | Retención MX | Catálogo |
| CxP | Factura AP | withholding_base | Condicional | Money | Base | ≥0 |
| CxP | Factura AP | withholding_amount | Condicional | Money | Retención | ≤ subtotal |
| Master | Proveedor | withholding_applicable | Sí | Boolean | Default retención | — |
| CxP | Captura AP | (vendor_id, invoice_number, legal_entity_id) | Sí | — | Unique | DB+UI |
| CxP | Detalle AP | match_status | Sí | Enum | MATCHED/TOLERANCE/FAILED/NOT_REQUIRED | — |
| Config | Match policy | match_tolerance_qty_pct | Sí | Percent | Over-receipt/invoice | 0–100 |
| Config | Match policy | match_tolerance_amt | Sí | Money/% | Diff PO vs AP | ≥0 |
| Compras | PO / Item | gr_based_invoice | Condicional | Boolean | STOCK default true | — |
| Compras | PO line | over_delivery_tolerance | Condicional | Percent | Default policy | ≥0 |
| Compras | PO line | under_delivery_tolerance | Condicional | Percent | Default policy | ≥0 |

## 19.4 Compras — account assignment

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Compras | PR/PO line | account_assignment_category | Sí | Enum | COST_CENTER/STOCK (+PROJECT/ASSET si enabled) | Enum |
| Compras | PR/PO line | cost_center_id | Condicional | Ref | Si COST_CENTER | Existe |
| Compras | PR/PO line | project_id | Condicional | Ref | Si PROJECT | Existe |
| Compras | PR/PO line | asset_id | Condicional | Ref | Si ASSET | Existe |
| CxP | AP line | cost_center_id | Condicional | Ref | Hereda PO o captura | Si expense |

## 19.5 Tesorería — dual control + banco vendor

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Tesorería | Orden de pago | maker_user_id | Sí | Ref | Solicitante | ≠ approver |
| Tesorería | Orden de pago | dual_control_approver_id | Condicional | Ref | Si amount ≥ threshold | Rol TRE2 |
| Tesorería | Orden de pago | dual_control_status | Sí | Enum | NOT_REQUIRED/PENDING/APPROVED | — |
| Config | Thresholds | dual_control_threshold | Sí | Money | Por LE | >0 |
| Compras | Vendor bank change | bank_change_request_id | Condicional | Ref | Cambio cuenta vía WF | BANK_CHANGE |
| Audit | Vendor bank | before/after | Sí | JSON | Trail | AuditFact |

## 19.6 Inventario — ATP (refuerzo)

| Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla de Negocio | Validación |
|--------|----------|-------|-------------|------|------------------|------------|
| Inventarios | Existencias | qty_on_hand | Sí | Number | Existencia física | ≥0 política |
| Inventarios | Existencias | qty_reserved | Sí | Number | Reservas SO/etc. | ≥0 |
| Inventarios | Existencias | qty_available | Sí (calc) | Number | on_hand − reserved | ≥0 si no negative stock |

## 19.7 Workflows de control (referencia)

PR_APPROVAL · PO_APPROVAL · AP_INVOICE_APPROVAL · PAYMENT_DUAL_CONTROL · BANK_CHANGE · CREDIT_OVERRIDE

---

**Fin ERP-FM-001** — Matriz funcional + Control Pack §19 (ERP-CP-001), alineada a ERP-SI-001 / ERP-SF-001.

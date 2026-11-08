# Catálogos y configuración cargable — Sistema ERP
## ERP-CAT-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-CAT-001 |
| Título | Inventario de catálogos / listas de referencia a configurar |
| Alcance | ERP Freeze release-1 (México) · sin GRP |
| Servicio | Principalmente `catalog-service` (+ seeds en accounting/IAM donde aplique) |
| Estado | Listo para seed / diseño de pantalla Catálogos |

> **No confundir** catálogo de referencia (UOM, TAX, términos de pago…) con **maestros de negocio** (proveedor, cliente, artículo, cuenta contable, banco). Ambos se “cargan”, pero viven en distintos servicios.

---

## 0. Cómo leer este inventario

| Tipo | Quién lo mantiene | Ejemplo |
|------|-------------------|---------|
| **A. Catálogo de referencia** | Admin / Master data en hub Catálogos | UOM, DOC_TYPE, PAYMENT_TERMS |
| **B. Configuración de sistema** | Admin (a menudo sin pantalla de usuario final) | Series de folio, umbrales WF, tolerancias match |
| **C. Catálogo fiscal SAT (MX)** | Seed oficial / actualización periódica | UsoCFDI, RégimenFiscal, FormaPago, ClaveProdServ |
| **D. Maestro de negocio** | Operación diaria (no es “catálogo genérico”) | Proveedor, Cliente, Artículo, COA, Almacén, Banco |
| **E. Seguridad** | Admin IAM | Roles, permisos, módulos de menú |

Prioridad: **MVP** = obligatorio para operar Freeze · **Pro** = útil pronto · **Ent** = más adelante.

---

## 1. Catálogos de referencia (tipo A) — MVP

Estos son los que el hub **Catálogos** debe poder listar/crear/desactivar.

| Código catálogo | Nombre | Para qué / pantallas | Valores mínimos sugeridos (ACME) |
|-----------------|--------|----------------------|----------------------------------|
| `CURRENCY` | Monedas | Todos los TX; multi-moneda ligera | `MXN` (funcional), `USD` |
| `UOM` | Unidades de medida | PR/OC/GR, artículos, SO, facturas | `PZA`, `KG`, `M`, `LT`, `SERV`, `HRA` |
| `TAX` | Impuestos (traslado) | Líneas OC/AP/AR/Billing | `IVA16`, `IVA0`, `EXENTO` (+ cuenta GL) |
| `TAX_WH` | Retenciones | Factura CxP (Control Pack) | `RET_ISR_10`, `RET_IVA_10_67`, `RET_ISR_RESICO` (ajustar a política) |
| `PAYMENT_TERMS` | Condiciones de pago | Proveedor, OC, factura AR/AP | `CONTADO`, `NET15`, `NET30`, `NET45` |
| `DOC_TYPE` | Tipos de documento expediente | Subir evidencia / case file | `COT`, `OC`, `FACT`, `CFDI_PDF`, `CFDI_XML`, `REC`, `CONTRATO`, `OTRO` |
| `PAYMENT_METHOD` | Método de pago (tesorería/CxP) | Propuesta / orden de pago | `TRANSFER`, `CHECK`, `CASH`, `SPEI` |
| `BANK_CODE` | Bancos (catálogo corto) | Cuentas bancarias / CLABE | Códigos banco MX comunes (012 Banorte, 014 Santander, 002 Banamex…) |
| `COUNTRY` | Países | Proveedor/cliente extranjero | `MX`, `US`, … |
| `ACCOUNT_ASSIGNMENT` | Categoría asignación | Líneas PR/OC | `COST_CENTER`, `STOCK` (+ `PROJECT`/`ASSET` si se habilitan) |
| `ITEM_TYPE` | Tipo de artículo | Maestro ítems | `STOCK`, `SERVICE` |
| `COSTING_METHOD` | Método de costeo | Ítems STOCK | `AVG`, `STD` |
| `PRIORITY` | Prioridad requisición | PR | `LOW`, `MED`, `HIGH` |
| `HOLD_REASON` | Motivos de bloqueo | Proveedor / crédito / payment_block | `CREDIT`, `QUALITY`, `LEGAL`, `DUPLICATE`, `OTHER` |
| `MATCH_RESOLUTION` | Resolución excepción match | WF match | `ACCEPT_PRICE`, `SHORT_CLOSE`, `REJECT`, `FORCE_MATCH` |
| `CREDIT_CHECK_RESULT` | Resultado crédito | SO / AR | `OK`, `HOLD`, `BLOCKED` |
| `WF_PROCESS` | Procesos workflow (códigos) | Admin / bandeja | `erp.pr.approve`, `erp.po.approve`, `erp.ap.match_exception`, `erp.ap.payment_dual`, `erp.ar.credit_exception`, `erp.gl.period_close` |
| `MODULE` | Módulos de menú | IAM claims / admin permisos | `core.*`, `erp.procurement`, `erp.inventory`, `erp.ap`, `erp.ar`, `erp.billing`, `erp.accounting`, `erp.treasury` |
| `PERMISSION` | Permisos finos (si no solo rol) | IAM | `*.read`, `*.write`, `*.approve`, `*.post`, `*.execute_payment` |
| `ROLE` | Roles Freeze | IAM | Ver ERP-SF-001 §5 / CFG-001 |
| `LOCALE` | Idioma UI | Perfil | `es-MX`, `en-US` |
| `MIME_ALLOW` | Tipos archivo permitidos | Documentos | `application/pdf`, `image/jpeg`, `image/png`, `text/xml` |

### Estados de documento (enums de dominio)

No siempre son filas de catálogo editables; conviene **seed fijo** (allowlist) para no romper máquinas de estado:

| Catálogo / enum | Valores típicos MVP |
|-----------------|---------------------|
| `PR_STATUS` | `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, `CANCELLED` |
| `PO_STATUS` | `DRAFT`, `SUBMITTED`, `APPROVED`, `REJECTED`, `CANCELLED`, `CLOSED`, `PARTIALLY_RECEIVED`, `RECEIVED` |
| `GR_STATUS` | `POSTED`, `REVERSED` |
| `AP_STATUS` | `RECEIVED`, `MATCHED`, `EXCEPTION`, `APPROVED`, `BLOCKED`, `PAID`, `VOID` |
| `MATCH_STATUS` | `PENDING`, `MATCHED`, `TOLERANCE`, `EXCEPTION`, `NOT_REQUIRED` |
| `SO_STATUS` | `DRAFT`, `CREDIT_HOLD`, `CONFIRMED`, `DELIVERED`, `INVOICED`, `CANCELLED` |
| `AR_STATUS` | `ISSUED`, `PARTIAL`, `PAID`, `VOID` |
| `JE_STATUS` | `DRAFT`, `POSTED`, `REVERSED` |
| `PERIOD_STATUS` | `OPEN`, `CLOSING`, `CLOSED` |
| `VENDOR_STATUS` / `CUSTOMER_STATUS` | `ACTIVE`, `ON_HOLD`, `BLOCKED` |
| `PAYMENT_DUAL_STATUS` | `NOT_REQUIRED`, `PENDING`, `APPROVED`, `REJECTED` |
| `FISCAL_STATUS` | `PENDING`, `STAMPED`, `ERROR`, `CANCELLED` |
| `MOVE_TYPE` | `IN`, `OUT`, `TRANSFER`, `ADJUST` |
| `RECEIPT_TYPE` | `FULL`, `PARTIAL` |
| `GL_ACCOUNT_TYPE` | `ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE` |

---

## 2. Configuración de sistema (tipo B) — MVP

Suele vivir en `catalog-service` como tipo `CONFIG` / tablas dedicadas, **no** como pantalla de usuario final (ERP-CP / SF).

### 2.1 Series de folio (`NUMBERING_SERIES`)

Por **legal_entity + doc_type**:

| Código serie | Documento | Formato ejemplo |
|--------------|-----------|-----------------|
| `PR` | Requisición | `PR-{YYYY}-{####}` |
| `PO` | Orden de compra | `PO-{YYYY}-{####}` |
| `GR` | Recepción | `GR-{YYYY}-{####}` |
| `VI` | Factura proveedor | `VI-{YYYY}-{####}` |
| `SO` | Pedido venta | `SO-{YYYY}-{####}` |
| `CI` | Factura cliente | `CI-{YYYY}-{####}` |
| `DN` | Entrega / remisión | `DN-{YYYY}-{####}` |
| `JE` | Asiento | `JE-{YYYY}-{####}` |
| `PY` | Pago / orden pago | `PY-{YYYY}-{####}` |
| `RC` | Cobro / recibo | `RC-{YYYY}-{####}` |
| `PP` | Propuesta de pago | `PP-{YYYY}-{####}` |

Atributos: `legal_entity_id`, `prefix`, `year_reset`, `padding`, `next_value` (atómico), `gapless` (política).

### 2.2 Umbrales y políticas (`POLICY` / `THRESHOLD`)

| Clave | Uso |
|-------|-----|
| `pr.auto_approve_max` | Auto-aprobación PR |
| `pr_purchasing_review` | Segundo paso compras |
| `po_manager` / `po_finance` | Escalamiento OC |
| `ap.match.price_tol_pct` | Tolerancia precio match |
| `ap.match.qty_tol_pct` | Tolerancia cantidad |
| `ap.dual_payment_threshold` | Dual control pago |
| `ar.credit.default_limit` | Límite crédito default alta cliente |
| `ar.credit.enforce_hard_block` | Bloqueo duro ON |
| `gr_based_invoice.default` | Política STOCK/SERVICE |
| `fx.required_if_currency_ne_functional` | Multi-moneda ligera |
| `je.approval_threshold` | (Pro) aprobación asiento |

### 2.3 Impuestos — atributos de ítem TAX

Por cada código en `TAX` / `TAX_WH`:

- `rate` · `tax_type` (VAT / WITHHOLDING) · `gl_account_input` · `gl_account_output` · `recoverable` · `active`

---

## 3. Catálogos fiscales SAT / CFDI 4.0 (tipo C) — MVP México

Cargar como seed (versión SAT) y **actualizar** cuando cambie el catálogo oficial. No inventar códigos.

| Catálogo SAT | Código interno sugerido | Uso en ERP |
|--------------|-------------------------|------------|
| c_Moneda | (alinear con `CURRENCY`) | CFDI + TX |
| c_Pais | (alinear con `COUNTRY`) | Receptor/emisor |
| c_UsoCFDI | `CFDI_USO` | Factura cliente |
| c_RegimenFiscal | `CFDI_REGIMEN` | Emisor + receptor |
| c_FormaPago | `CFDI_FORMA_PAGO` | Factura / cobro |
| c_MetodoPago | `CFDI_METODO_PAGO` | PUE / PPD |
| c_TipoDeComprobante | `CFDI_TIPO` | I, E, T, N, P (MVP: I, E) |
| c_Exportacion | `CFDI_EXPORTACION` | 01/02/03/04 |
| c_ObjetoImp | `CFDI_OBJETO_IMP` | Líneas 4.0 |
| c_Impuesto | (map a `TAX`) | 002 IVA, 001 ISR, 003 IEPS |
| c_TipoFactor | `CFDI_TIPO_FACTOR` | Tasa / Cuota / Exento |
| c_ClaveUnidad | (map parcial a `UOM`) | CFDI |
| c_ClaveProdServ | `CFDI_CLAVE_PROD_SERV` | Línea factura (catálogo grande → búsqueda) |
| c_CodigoPostal | `CFDI_CP` | Domicilio fiscal (o validación externa) |
| c_Periodicidad / c_Meses | `CFDI_GLOBAL_*` | Factura global (si se usa) |
| Motivos cancelación | `CFDI_MOTIVO_CANCEL` | Cancelación 4.0 (01–04) |

**Series fiscales / CSD** (tipo B+C, setup Pro en SI): certificado, key, password vault, vigencia — no van en catálogo libre editable.

---

## 4. Maestros de negocio (tipo D) — se cargan, pero no son “catálogo genérico”

| Maestro | Servicio dueño | Seed mínimo ACME |
|---------|----------------|------------------|
| Legal Entity / compañía | IAM / org | 1 LE MX |
| Org units / centros de costo | IAM / catalog ORG | Compras, Almacén, Finanzas, Ventas + CC 100/200/300 |
| Plan de cuentas (COA) | accounting | Cuentas CFG-001 |
| Periodos contables | accounting | Año corriente OPEN |
| Proveedores | procurement | 3 (nac / ext / servicio) |
| Clientes + crédito | ar-billing | 3 con límites |
| Artículos | inventory | 10 STOCK/SERVICE |
| Almacenes / ubicaciones | inventory | WH-MAIN, BIN-01 |
| Cuentas bancarias | treasury | 1 cuenta → GL 1100 |
| Tipos de cambio | catalog o accounting | MXN/USD del día (si multi-moneda) |

`BUDGET_CATEGORY` / partidas CONAC del OpenAPI legado = **GRP — no cargar en ERP**.

---

## 5. Seguridad y menú (tipo E)

| Elemento | Contenido |
|----------|-----------|
| Roles Freeze | Requestor, Purchasing, Warehouse, AP, AR, Credit, Treasury, Accountant, Finance Controller, Master Data, Admin |
| Módulos menú | Ver `MODULE` arriba |
| Matriz rol → módulos | Ej. AP → `erp.ap` + `core.workflow`; Admin → todos + IAM |
| SoD policies | Combinaciones prohibidas (ERP-SOD-001) |

---

## 6. Prioridad de carga (orden práctico)

```text
1. CURRENCY, COUNTRY, LOCALE
2. UOM, PAYMENT_TERMS, PAYMENT_METHOD, BANK_CODE
3. TAX + TAX_WH (+ cuentas GL)
4. DOC_TYPE, MIME_ALLOW, HOLD_REASON, ACCOUNT_ASSIGNMENT, ITEM_TYPE
5. NUMBERING_SERIES + THRESHOLD/POLICY
6. ROLE, MODULE, PERMISSION + matriz admin
7. Enums de estado (seed fijo)
8. Catálogos SAT CFDI 4.0 (Uso, Régimen, Forma/Método, ObjetoImp, ClaveProdServ…)
9. Maestros: LE, OU/CC, COA, periodos, almacén, banco
10. Proveedores / clientes / artículos demo
```

---

## 7. Profesional / Empresarial (no bloquear release-1)

| Catálogo | Cuándo |
|----------|--------|
| Lista de precios / descuentos | Pro ventas |
| Motivos NC / devolución | Pro |
| Motivos de ajuste inventario | Pro |
| Dimensiones controlling extra | Ent |
| Idiomas / traducciones UI extra | Pro |
| Feature flags por módulo tenant | Ent |
| Catálogo compras punch-out | Pro (OUT Freeze pantalla, opcional config) |

---

## 8. Impacto en OpenAPI `catalog-service`

Hoy el contrato baseline solo enumera:

`ORG_UNIT`, `BUDGET_CATEGORY`, `SUPPLIER_BASIC`, `CURRENCY`, `DOC_TYPE`

Para el track ERP hay que **ampliar** `CatalogType` (o tipos versionados) con al menos:

`UOM`, `TAX`, `TAX_WH`, `PAYMENT_TERMS`, `PAYMENT_METHOD`, `BANK_CODE`, `COUNTRY`, `ACCOUNT_ASSIGNMENT`, `ITEM_TYPE`, `COSTING_METHOD`, `PRIORITY`, `HOLD_REASON`, `NUMBERING_SERIES`, `THRESHOLD`, `CFDI_*`, `MODULE`, `ROLE`…

y **excluir** `BUDGET_CATEGORY` del camino ERP (o marcarlo GRP-only).

---

## 9. Resumen ejecutivo

| Grupo | Cantidad aprox. a configurar en MVP |
|-------|-------------------------------------|
| Catálogos referencia operativos | ~20 |
| Enums de estado (seed fijo) | ~15 |
| Series de folio | ~11 |
| Políticas / umbrales | ~10 |
| Catálogos SAT CFDI 4.0 | ~12–15 (ClaveProdServ = volumen alto) |
| Maestros mínimos ACME | LE, OU, COA, ítems, partners, almacén, banco |

**Sin esta carga**, el login y el menú pueden existir, pero **ningún documento de negocio** (PR, OC, factura, CFDI) puede validarse correctamente.

---

**Fin ERP-CAT-001**

# Paquete de control ERP MVP
## ERP-CP-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-CP-001 |
| Título | Paquete de control MVP — campos obligatorios antes de backend |
| Tipo | Delta de campos y reglas |
| Estado | **Normativo para el congelamiento** — `feat-ERP` |
| Idioma | Español |
| Origen | ERP-XR-001 Puerta B |
| Destino | Fusionado en ERP-FM-001 §19 |
| Congelamiento | ERP-SF-001 |

---

## 1. Propósito

Definir el conjunto **mínimo no negociable** de campos y reglas de control financiero/operativo que deben existir en contratos (OpenAPI / base de datos / interfaz) del ERP MVP, aunque no estuvieran completos en la matriz FM-001 versión inicial.

Sin este paquete: **no** abrir OpenAPI ni Angular de CxP / CxC / contabilidad / tesorería / pedidos.

Los **nombres de campo** (`legal_entity_id`, etc.) se mantienen en inglés como identificadores de API; la columna de regla/validación está en español.

---

## 2. Controles (12) — especificación

Formato alineado a la matriz: `Módulo | Pantalla | Campo | Obligatorio | Tipo | Regla | Validación`

### CP-01 Entidad legal

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla de negocio | Validación |
|--------|----------|-------|------|------|------------------|------------|
| Transversal | Todo documento transaccional | legal_entity_id | Sí | Ref | El documento pertenece a una entidad legal del tenant | Existe; el usuario tiene alcance |
| Transversal | Todo documento transaccional | company_code | Cond. | Text | Alias de visualización de la entidad (estilo SAP) | Único por tenant |

### CP-02 Numeración / folios

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Transversal | Requisición/OC/Recepción/CxP/CxC/Pedido/Asiento/Pago | document_number | Sí (al enviar/contabilizar) | Text | Folio humano por serie + entidad + tipo | Único; política sin huecos por serie |
| Admin/Config | Series de numeración | series_code, doc_type, legal_entity_id, next_value | Sí | — | Configuración (no pantalla de usuario final) | `next_value` atómico |

### CP-03 Crédito del cliente

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Maestro | Ficha cliente | credit_limit | Sí | Money | Límite autorizado | ≥ 0 |
| Maestro | Ficha cliente | credit_block | Sí | Boolean | Bloqueo manual duro | — |
| Calculado | Cliente / Pedido | credit_exposure | Sí (calc) | Money | Pedidos abiertos + CxC abierta | Sistema |
| Ventas | Crear/Confirmar pedido | credit_check_result | Sí | Enum | OK / HOLD / BLOCKED | BLOCKED ⇒ no confirmar |
| Ventas | Pedido | credit_override_reason | Cond. | Text | Si un aprobador anula HOLD | mín. 10 caracteres + flujo |

### CP-04 Bloqueo de proveedor / pago

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Compras | Ficha proveedor | hold_reason | Cond. | Text/Enum | Si estado BLOCKED o retención de pago | Obligatorio al bloquear |
| CxP | Factura proveedor | payment_block | Sí | Boolean | Impide incluir en propuesta de pago | — |
| CxP | Factura proveedor | payment_block_reason | Cond. | Text | Si payment_block = true | mín. 5 caracteres |

### CP-05 Doble control de pagos

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Tesorería | Orden de pago | maker_user_id | Sí | Ref | Quien crea/solicita | ≠ aprobador |
| Tesorería | Orden de pago | dual_control_approver_id | Cond. | Ref | Si importe ≥ umbral de la entidad | ≠ solicitante; rol TRE2 |
| Tesorería | Orden de pago | dual_control_status | Sí | Enum | NOT_REQUIRED / PENDING / APPROVED | — |
| Config | Umbrales de pago | dual_control_threshold | Sí | Money | Por entidad / moneda | > 0 |

### CP-06 Cambio de cuenta bancaria del proveedor

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Compras | Ficha proveedor | bank_account | Sí | Text | Cuenta de pago | Mostrar enmascarada |
| Compras | Cambio de banco | bank_change_request_id | Cond. | Ref | Todo cambio de banco vía solicitud | Flujo BANK_CHANGE |
| Auditoría | Banco proveedor | before/after bank | Sí | JSON | Rastro obligatorio | Hecho de auditoría |

### CP-07 Tolerancias de cuadre (match)

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Config | Política de cuadre | match_tolerance_qty_pct | Sí | Percent | Sobre-recepción / cantidad factura | 0–100 |
| Config | Política de cuadre | match_tolerance_amt | Sí | Money/% | Diferencia OC vs factura | ≥ 0 |
| CxP | Detalle factura | match_status | Sí | Enum | MATCHED / TOLERANCE / FAILED / NOT_REQUIRED | — |
| Compras | Línea OC | over_delivery_tolerance | Cond. | Percent | Por defecto desde política | ≥ 0 |
| Compras | Línea OC | under_delivery_tolerance | Cond. | Percent | Por defecto desde política | ≥ 0 |
| Compras | OC / Artículo | gr_based_invoice | Cond. | Boolean | true ⇒ exige recepción antes de CxP | STOCK por defecto true |

### CP-08 Asignación contable (account assignment)

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Compras | Línea requisición/OC | account_assignment_category | Sí | Enum | COST_CENTER / PROJECT / ASSET / STOCK | Enum cerrado |
| Compras | Línea requisición/OC | cost_center_id | Cond. | Ref | Si categoría = COST_CENTER | Existe centro/OU |
| Compras | Línea requisición/OC | project_id | Cond. | Ref | Si categoría = PROJECT | Existe (si proyectos habilitados) |
| Compras | Línea requisición/OC | asset_id | Cond. | Ref | Si categoría = ASSET | Existe |
| CxP | Línea factura | cost_center_id | Cond. | Ref | Hereda de OC o se captura | Requerido si es gasto |

**Nota del congelamiento:** en release-1, categorías habilitadas = **COST_CENTER** y **STOCK**. PROJECT/ASSET solo si se activan stubs; por defecto deshabilitar en configuración.

### CP-09 Tipo de cambio (multi-moneda ligero)

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Transversal | Documentos con moneda | currency | Sí | Enum | ISO-4217 | |
| Transversal | Documentos | exchange_rate | Cond. | Number | Si moneda ≠ funcional de la entidad | > 0 |
| Transversal | Documentos | rate_date | Cond. | Date | Fecha de la tasa | ≤ fecha contable |
| Transversal | Documentos | rate_type | Cond. | Enum | SPOT / COMPANY / MANUAL | |
| Transversal | Líneas | functional_currency_amount | Cond. | Money | importe × tasa | Calculado; auditar si MANUAL |

### CP-10 Retenciones México

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| CxP | Factura proveedor | withholding_tax_code | Cond. | Ref | Si proveedor/servicio sujeto a retención | Catálogo TAX_WH |
| CxP | Factura proveedor | withholding_amount | Cond. | Money | Calculado o capturado | ≥ 0; ≤ subtotal |
| CxP | Factura proveedor | withholding_base | Cond. | Money | Base gravable | ≥ 0 |
| Maestro | Proveedor | withholding_applicable | Sí | Boolean | Indica si aplica retención por defecto | |

### CP-11 Contabilizado por / en (guardar vs contabilizar)

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| Transversal | Asiento/CxP/CxC/Pago/Recepción | created_by | Sí | Ref | Usuario de creación | |
| Transversal | | created_at | Sí | DateTime | | |
| Transversal | | posted_by | Cond. | Ref | Al pasar a POSTED/ISSUED/SENT | Permiso post:* |
| Transversal | | posted_at | Cond. | DateTime | | ≥ created_at |
| Contabilidad/CxP | Acciones de UI | acción guardar vs contabilizar | Sí | — | Botones separados | RBAC distinto |

### CP-12 Unicidad de factura de proveedor

| Módulo | Pantalla | Campo | Obl. | Tipo | Regla | Validación |
|--------|----------|-------|------|------|-------|------------|
| CxP | Captura factura | vendor_id + invoice_number + legal_entity_id | Sí | — | Unicidad | Restricción única en BD + UI |

*(Ya estaba en la matriz; se eleva al paquete de control con la entidad legal en la clave.)*

---

## 3. Umbrales piloto ACME (propuesta de configuración)

| Parámetro | Valor propuesto piloto | Significado |
|-----------|------------------------|------------|
| dual_control_threshold (MXN) | 50,000 | Importe desde el cual el pago exige doble control |
| Umbral aprobación de OC | 200,000 | OC sobre este monto → flujo de aprobación |
| Umbral factura CxP sin OC | 100,000 | Factura sin OC sobre este monto → aprobación |
| match_tolerance_qty_pct | 2% | Tolerancia de cantidad en cuadre |
| match_tolerance_amt | 1% o $10 (el menor) | Tolerancia de importe |
| credit_check | Activado | Validación de crédito en pedidos |
| gr_based_invoice default STOCK | true | Bienes exigen recepción antes de facturar |
| gr_based_invoice default SERVICE | false | Servicios: cuadre doble OC↔factura |

---

## 4. Flujos de trabajo adicionales mínimos

| Código de proceso | Disparador | Nombre en español |
|------------------|------------|-------------------|
| PR_APPROVAL | Envío de requisición | Aprobación de requisición |
| PO_APPROVAL | Envío de OC / por importe | Aprobación de orden de compra |
| AP_INVOICE_APPROVAL | CxP sin OC, fuera de tolerancia o por importe | Aprobación de factura proveedor |
| PAYMENT_DUAL_CONTROL | Pago ≥ umbral | Doble control de pago |
| BANK_CHANGE | Actualización de banco del proveedor | Cambio de cuenta bancaria |
| CREDIT_OVERRIDE | Anulación de retención por crédito en pedido | Excepción de crédito |

---

## 5. Lista de verificación de fusión

- [x] Publicado ERP-CP-001  
- [x] Volcado en ERP-FM-001 §19  
- [x] Referenciado por ERP-SF-001  
- [x] Umbrales §3 adoptados con VoBo del congelamiento  
- [ ] OpenAPI incluye propiedades CP-*  
- [ ] Migración Flyway: único (proveedor, folio factura, entidad legal)  

---

**Fin ERP-CP-001**

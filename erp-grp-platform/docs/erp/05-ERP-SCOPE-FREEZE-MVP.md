# Congelamiento de alcance ERP — MVP
## ERP-SF-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-SF-001 |
| Título | Congelamiento de alcance del ERP MVP (capa privada / comercial) |
| Tipo | Congelamiento de producto · Definición de listo (DoR) ejecutivo |
| Estado | **Aprobado (VoBo)** — `feat-ERP` · 2026-11-07 |
| Idioma | Español |
| Entradas | ERP-SI-001 · ERP-FM-001 · ERP-XR-001 · ERP-UX-001 · DDD-PORT-001 |
| Complemento | ERP-CP-001 (Paquete de control) |
| Piloto de referencia | ACME Industrial (MX) — demo `erp-preview/` |

> **Regla:** lo que no esté listado como **DENTRO** queda **FUERA** del primer release ERP.  
> Cambios posteriores requieren enmienda versionada (`ERP-SF-001.rN`) con VoBo de DG + CFO + Controller.  
> **Separación de productos:** este congelamiento es **solo ERP**. GRP (gobierno) y expansiones tipo suite SAP completa (WMS/MFG/TMS/etc. empresariales) van en **iniciativas aparte**; no compartir pantallas, backlog ni bases de datos con esos hilos.

**Equivalencias rápidas:** DENTRO = IN · FUERA = OUT · Compra a pago = P2P · Pedido a cobro = O2C · Ver [glosario](07-GLOSARIO-ERP-DESARROLLO.md).

---

## 1. Declaración de congelamiento

Queda congelado el **núcleo operativo del ERP MVP**:

**Compras a pago (P2P) + Pedido a cobro ligero (O2C) + Finanzas operativas (contabilidad / CxP / CxC / facturación / tesorería) + Inventario básico + Plataforma (identidad, flujos, documentos, auditoría, catálogos).**

Fuera del congelamiento: manufactura, almacén avanzado (WMS), transporte (TMS), cotizador (CPQ), portales, GRP/CONAC, consolidación intercompañía, estudio GRC, nómina profunda (ver Puerta A).

---

## 2. Puerta A — Decisiones de producto (congeladas)

| # | Decisión | Valor congelado | Implicación |
|---|----------|-----------------|-------------|
| A1 | País / localización MVP | **México primero** | Catálogos fiscales MX; CFDI en facturación; validaciones RFC |
| A2 | CFDI | **DENTRO** (emisión + UUID en CxP opcional/condicional) | Facturación emite; CxP captura `cfdi_uuid` si la política de la compañía lo exige |
| A3 | Retenciones (ISR/IVA) | **DENTRO** (Paquete de control) | Campos de retención en factura proveedor + configuración de impuestos |
| A4 | Nómina | **FUERA** del release-1 del ERP MVP | Pantallas demo = marcadas stub Profesional; sin IMSS/CURP obligatorios en release-1 |
| A5 | Multi-moneda | **DENTRO (ligero)** | Los documentos permiten moneda ≠ funcional; **obligatorio** `exchange_rate` + `rate_date` si la moneda ≠ moneda de la compañía |
| A6 | Cuadre OC / recepción / factura (match) | **Híbrido** | Bienes STOCK: **triple** (3-way); SERVICIO: **doble** (2-way OC↔factura) salvo bandera `gr_based_invoice` |
| A7 | Crédito cliente | **DENTRO (bloqueo duro)** | `credit_block` / exposición bloquean confirmar pedido y emitir CxC |
| A8 | Doble control de pagos | **DENTRO** | Órdenes de pago sobre umbral requieren 2º aprobador ≠ solicitante |
| A9 | Guardar vs contabilizar (park/post) | **DENTRO** | Crear ≠ Contabilizar en asientos, CxP, cobros y pagos bancarios |
| A10 | Multi-compañía | **DENTRO (1–N entidades legales en el mismo tenant)** | `legal_entity_id` obligatorio en todo documento transaccional |

**VoBo Puerta A**

| Rol | Nombre | Fecha | Sí/No |
|-----|--------|-------|-------|
| Director General | Dueño de producto (VoBo en chat) | 2026-11-07 | Sí |
| CFO | Dueño de producto (VoBo en chat) | 2026-11-07 | Sí |
| Controller | Dueño de producto (VoBo en chat) | 2026-11-07 | Sí |

> VoBo: congelamiento + paquete de control aceptados. Umbrales piloto ACME (ERP-CP-001 §3) aplican salvo enmienda.

---

## 3. Puerta C — Fichas / pantallas objeto MVP (DENTRO — diseñar/construir)

Únicas fichas del release-1 (lista + detalle + captura según inventario SI):

### 3.1 Plataforma (envoltorio)

| Pantalla / objeto | Notas |
|-------------------|--------|
| Inicio de sesión / selección de compañía | |
| Inicio / lanzador por rol | |
| Bandeja de aprobación | Envoltorio único |
| Notificaciones | |
| Mi perfil | |
| Expediente / Visor / Subir evidencia | Envoltorio único |
| Consulta de auditoría por documento | |
| Usuarios · Roles · Organización · Catálogos | Administración mínima |

### 3.2 Datos maestros

| Objeto | Notas |
|--------|--------|
| Proveedor | Incluye banco + bloqueo |
| Cliente | Incluye crédito |
| Artículo | STOCK/SERVICE + costeo |
| Plan de cuentas | |
| Periodo contable | |
| Cuenta bancaria | |
| Centro de costo / unidad org. | vía estructura organizacional |

### 3.3 Compras a pago (P2P)

| Objeto | Notas |
|--------|--------|
| Requisición | |
| Orden de compra | |
| Recepción de mercancías/servicios | |
| Factura de proveedor (CxP) | + panel de cuadre |
| Propuesta / programación de pagos | |
| Antigüedad CxP · saldo proveedor | Consultas |

### 3.4 Pedido a cobro + facturación (O2C)

| Objeto | Notas |
|--------|--------|
| Pedido de venta | + validación de crédito |
| Entrega / remisión | |
| Factura cliente / CFDI | |
| Cobro / aplicación | |
| Antigüedad CxC · estado de cuenta | Consultas |

### 3.5 Contabilidad + tesorería

| Objeto | Notas |
|--------|--------|
| Asiento contable | guardar vs contabilizar |
| Mayor / balanza / estados financieros básicos | Consultas/reportes |
| Orden de pago bancaria | doble control |
| Conciliación bancaria | |
| Posición de efectivo | |

### 3.6 Inventario

| Objeto | Notas |
|--------|--------|
| Existencias (disponible / reservado / on hand) | ATP |
| Movimiento de inventario | entrada/salida/traspaso/ajuste |

### 3.7 Analítica

| Objeto | Notas |
|--------|--------|
| Tablero ejecutivo / por rol | Indicadores del núcleo |
| Reportes estándar (exportar) | Sin BI embebido |

**Orientación:** ~45 pantallas MVP del inventario — **no** ampliar a Profesional/Empresarial en release-1.

---

## 4. FUERA explícito (prohibido en release-1)

| Dominio | Fuera de alcance |
|---------|------------------|
| Manufactura | MRP, listas de materiales, órdenes de fabricación, capacidad, piso |
| Almacén avanzado (WMS) | ubicaciones, olas, putaway, RF avanzado |
| Transporte / flota (TMS) | |
| Cotizador / suscripciones (CPQ) | |
| Portales | proveedor, cliente, autoservicio empleado avanzado |
| GRP / sector público | presupuesto CONAC, obra pública, transparencia, ciudadano |
| Nómina profunda | incidencias IMSS, timbrado nómina, dispersión productiva |
| Activo fijo profundo | altas masivas, bajas complejas (stub OK en demo) |
| Proyectos profundos | EDT/costeo avanzado (stub OK) |
| Tesorería avanzada | coberturas, deuda, leasing, cash pooling |
| GRC | matriz SoD rica, impersonación, estudio de auditoría |
| Intercompañía | consolidación, eliminaciones |
| CRM avanzado | embudo de oportunidades completo |

---

## 5. Roles release-1 (RBAC mínimo)

| Código | Rol | Capacidades núcleo |
|--------|-----|-------------------|
| EMP | Solicitante | Crear/enviar requisición |
| BUY | Comprador | Requisición→OC, proveedor (lectura/escritura limitada) |
| INV | Almacén | Recepción, existencias, movimientos |
| SAL | Vendedor | Pedido, entrega, solicitud de facturación |
| AP | Contador CxP | Factura proveedor guardar/contabilizar, propuesta de pago |
| AR | Contador CxC | Factura cliente, cobros |
| GL | Contador general | Asientos, periodos, plan de cuentas (con ADM) |
| TRE | Tesorería (ejecutor) | Pagos bancarios (quien solicita), conciliación, efectivo |
| TRE2 | Tesorería (aprobador) | Doble control de pagos (≠ TRE ejecutor) |
| APPR | Gerente / aprobador | Bandeja de aprobaciones |
| ADM | Administrador | Usuarios, roles, catálogos, organización |
| CFO | Director financiero | Lectura + aprobar alto valor; tableros |
| AUD | Auditor | Solo lectura de auditoría |
| DG | Dirección general | Tableros / aprobar excepciones |

**Segregación de funciones mínima (no negociable):**

1. Quien crea/modifica **cuenta bancaria del proveedor** ≠ quien **aprueba el pago**.  
2. **Ejecutor de tesorería (TRE)** ≠ **aprobador (TRE2)** en el mismo pago.  
3. Quien **guarda** asiento/CxP y quien **contabiliza** son permisos separados (mismo usuario solo si la política lo permite y queda auditado).  
4. Cambio de banco del proveedor → flujo de aprobación + auditoría antes/después.

---

## 6. Flujos de dinero y control (Puerta D)

Toda transición con impacto monetario exige:

| Control | Requisito |
|---------|-----------|
| Permiso RBAC | Acción explícita |
| Flujo de trabajo o doble control | Según matriz de umbrales |
| Hecho de auditoría | antes/después + actor + marca de tiempo |
| Clave de idempotencia | En aprobar / contabilizar / pagar |
| Entidad legal | `legal_entity_id` en cabecera |
| Periodo | Contabilizar solo si el periodo está ABIERTO (o política de cierre suave) |

Estados canónicos (no inventar otros en release-1) — código EN / significado ES:

| Código | Significado |
|--------|------------|
| DRAFT | Borrador |
| SUBMITTED | Enviada |
| PENDING_APPROVAL | Pendiente de aprobación |
| APPROVED / REJECTED | Aprobada / Rechazada |
| SENT | Enviada a proveedor/banco |
| PARTIALLY_RECEIVED / RECEIVED | Recibo parcial / Recibida |
| POSTED | Contabilizada |
| PARTIALLY_PAID / PAID | Pago parcial / Pagada |
| ISSUED | Emitida (factura cliente) |
| CONFIRMED / DELIVERED / INVOICED | Confirmado / Entregado / Facturado |
| CREDIT_HOLD | Retenido por crédito |
| PENDING_DUAL | Pendiente de doble control |
| CLEARED | Compensada / conciliada |
| CLOSED / VOID | Cerrada / Anulada |

Ciclos:

- **Requisición:** DRAFT → SUBMITTED → APPROVED/REJECTED → CLOSED  
- **OC:** DRAFT → PENDING_APPROVAL → APPROVED → SENT → PARTIALLY_RECEIVED → RECEIVED → CLOSED  
- **Recepción:** DRAFT → POSTED  
- **Factura CxP:** DRAFT → PENDING_APPROVAL → POSTED → PARTIALLY_PAID → PAID / VOID  
- **Pago:** DRAFT → PENDING_DUAL → APPROVED → SENT → CLEARED  
- **Pedido venta:** DRAFT → CREDIT_HOLD/CONFIRMED → DELIVERED → INVOICED → CLOSED  
- **Factura CxC:** DRAFT → ISSUED → PARTIALLY_PAID → PAID / VOID  
- **Asiento:** DRAFT → POSTED / VOID  

---

## 7. Servicios / contextos delimitados (mapa release-1)

| Servicio | En release-1 | Nota |
|----------|--------------|------|
| iam-service (identidad) | DENTRO | Ya en núcleo |
| catalog-service (catálogos) | DENTRO | Maestros + series de folio |
| workflow-service (flujos) | DENTRO | Requisición/OC/CxP/Pago/crédito |
| document-service (documentos) | DENTRO | Expedientes |
| audit-service (auditoría) | DENTRO | Rastro |
| procurement-service (compras) | DENTRO | Proveedor, requisición, OC, recepción |
| inventory-service (inventario) | DENTRO | Existencias, movimientos, disponible |
| Módulo o servicio CxP | DENTRO | Facturas proveedor + propuesta de pago |
| Módulo o servicio CxC / facturación | DENTRO | Pedido→factura, CFDI (adaptador) |
| accounting-service (contabilidad) | DENTRO | Plan de cuentas, periodos, asientos |
| treasury-service (tesorería) | DENTRO | Bancos, ejecución de pagos, conciliación |
| payroll-service (nómina) | **FUERA** release-1 | |
| budget-service (presupuesto GRP) | **FUERA** ERP MVP | Dominio GRP |

\* Empaquetado micro vs modular: ADR posterior; **no compartir base de datos** entre CxP / CxC / contabilidad / nómina / compras.

---

## 8. Criterios de aceptación del congelamiento (DoR)

El ERP MVP está **listo para OpenAPI / Angular / migraciones** si:

- [x] Puerta A documentada (§2)  
- [x] Puerta A con VoBo DG+CFO+Controller (2026-11-07)  
- [x] Pantallas objeto DENTRO/FUERA publicadas (§3–§4)  
- [x] Paquete de control ERP-CP-001 publicado  
- [x] Delta del paquete volcado en ERP-FM-001 (§19)  
- [x] Segregación mínima publicada (§5)  
- [x] Umbrales piloto ACME adoptados (ERP-CP-001 §3) — ajustables por enmienda  
- [ ] Responsable técnico asignado por servicio §7  

La demo HTML (`erp-preview`) **no sustituye** este congelamiento: es especificación de experiencia, no DoR de ingeniería.

---

## 9. Enmiendas

| Rev | Fecha | Cambio | VoBo |
|-----|-------|--------|------|
| r0 | 2026-11-07 | Creación y aprobación del congelamiento MVP | Dueño de producto |
| r0.1 | 2026-11-07 | Redacción completa en español para el equipo de desarrollo | — |
| r0.2 | 2026-11-07 | Aclaración: foco solo ERP; GRP y suite SAP aparte | Dueño de producto |

---

## 10. Siguientes documentos / trabajo (post-VoBo)

1. OpenAPI + eventos por servicio DENTRO (§7) — en español en descripciones; propiedades en inglés  
2. Modelo de datos / Flyway compras-inventario-finanzas  
3. Aplicación Angular: envoltorio + fichas de la Puerta C  
4. Configuración de umbrales / series / tolerancias (no pantallas de usuario final)

---

**Fin ERP-SF-001**

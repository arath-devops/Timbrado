# Acoplamiento pre-desarrollo ERP
## ERP-AC-001

| Campo | Valor |
|-------|--------|
| Documento | ERP-AC-001 |
| Título | Qué falta acoplar para respetar el Freeze antes de desarrollar |
| Entrada | Lista funcional VoBo · ERP-SF-001 · ERP-CP-001 · ERP-FM-001 · ERP-SI-001 · preview · arquitectura servicios |
| Estado | Diagnóstico — `feat-ERP` |
| Idioma | Español |
| Alcance | **Solo ERP** (sin GRP) |

> Objetivo: que **todas** las funcionalidades del congelamiento tengan dueño, contrato, datos, flujo y UI-spec alineados **antes** de escribir backend/Angular de producto.

---

## 0. Resumen ejecutivo

| Semáforo | Hallazgo |
|----------|----------|
| Rojo | No hay OpenAPI/eventos/Flyway de inventario, CxP, CxC, facturación, contabilidad ni tesorería |
| Rojo | Arquitectura aún acopla `procurement` ↔ `budget` (GRP); hay que **desacoplar** para ERP puro |
| Ámbar | Paquete de control está en FM §19, pero **no está repartido** pantalla por pantalla en §1–§14 ni en el preview (retenciones, dual control, bloqueo pago, folios) |
| Ámbar | Flujos WF solo cubren núcleo genérico; faltan procesos Freeze (crédito, dual pago, cambio banco, CxP) |
| Verde | Inventario de pantallas + Freeze + Control Pack + preview P0 (crédito/ATP/match/líneas/roles) |

**No seguir con desarrollo de producto** hasta cerrar al menos los ítems **BLOQUEANTES** de la §5.

---

## 1. Matriz funcional → estado de acoplamiento

Leyenda: **OK** listo · **PARCIAL** existe pero incompleto · **FALTA** no acoplado.

### 1.1 Plataforma

| Funcionalidad Freeze | SI/FM | Preview | OpenAPI/servicio | Qué acoplar |
|----------------------|-------|---------|------------------|-------------|
| Login + compañía / entidad legal | OK | PARCIAL (login+rol; LE poco visible en docs) | IAM OK | Propagar `legal_entity_id` a todos los contratos TX |
| Lanzador por rol | OK | OK (menú filtrado) | IAM `/me/menus` PARCIAL | Definir menú ERP-only (sin tiles GRP) |
| Bandeja de aprobación | OK | PARCIAL | Workflow OK base | Deep link + procesos ERP listados en §3 |
| Notificaciones / perfil | OK | OK | PARCIAL | Contrato de notificaciones in-app |
| Expediente / visor / subir | OK | OK | Document OK | Tipos DOC Freeze (OC, FACT, CFDI, COT…) |
| Auditoría por documento | OK | Stub | Audit OK | Esquema before/after + eventos de post/pay |
| Usuarios / roles / org / catálogos | OK | OK | IAM+Catalog OK | Roles Freeze (§5 SF) + catálogos fiscales MX |
| Series de folio | CP OK | FALTA | FALTA | Config `numbering series` en catalog o config-service |

### 1.2 Compras (P2P)

| Funcionalidad | SI/FM | Preview | OpenAPI | Qué acoplar |
|---------------|-------|---------|---------|-------------|
| Requisiciones | OK | OK P0 | Procurement PARCIAL | Campos CP: LE, folio, account assignment |
| Órdenes de compra | OK | OK P0 | Procurement PARCIAL | Tolerancias, `gr_based_invoice`, FX |
| Recepción | OK | OK | Procurement PARCIAL | Open qty + evento a inventario |
| Proveedores + banco + bloqueo | OK | PARCIAL | PARCIAL | `hold_reason`, WF cambio de banco |
| OC desde PR | OK regla | OK UI | FALTA endpoint | API `POST /po from-pr` |

**Bloqueo crítico:** docs de arquitectura hacen commit a **budget-service (GRP)**. Para ERP: compromiso de compra **no** debe depender de presupuesto público. Definir regla ERP (opcional centro de costo / sin funds check GRP).

### 1.3 Inventario

| Funcionalidad | SI/FM | Preview | OpenAPI | Qué acoplar |
|---------------|-------|---------|---------|-------------|
| Artículos | OK | OK | **FALTA servicio** | Crear `inventory-service` contrato |
| Existencias ATP | OK (+CP) | OK | FALTA | Modelo on_hand/reserved/available |
| Movimientos | OK | OK | FALTA | Tipos IN/OUT/TRANSFER/ADJUST |
| Recepción almacén | OK | OK | FALTA | Consumir evento GR de procurement |

### 1.4 Ventas + crédito

| Funcionalidad | SI/FM | Preview | OpenAPI | Qué acoplar |
|---------------|-------|---------|---------|-------------|
| Pedidos de venta | OK | OK P0 | **FALTA** | Servicio ventas o módulo O2C |
| Crédito cliente | CP OK | OK stub | FALTA | Maestro customer + motor crédito |
| Entregas | OK | OK | FALTA | Baja de inventario + enlace a facturación |

### 1.5 Facturación

| Funcionalidad | SI/FM | Preview | OpenAPI | Qué acoplar |
|---------------|-------|---------|---------|-------------|
| Emisión factura / CFDI | OK | PARCIAL | FALTA | Puerto CFDI (adaptador) + AR invoice |
| Lista comprobantes | OK | PARCIAL | FALTA | Estados ISSUED/VOID |

### 1.6 CxP

| Funcionalidad | SI/FM | Preview | OpenAPI | Qué acoplar |
|---------------|-------|---------|---------|-------------|
| Captura / detalle factura | OK | OK P0 líneas | **FALTA** | `ap-service` o finance-ap |
| Cuadre 2/3-way | CP OK | OK panel | FALTA | Motor match + tolerancias config |
| Retenciones MX | CP OK | **FALTA UI** | FALTA | Campos + catálogo TAX_WH |
| Bloqueo de pago | CP OK | **FALTA UI** | FALTA | `payment_block` |
| Propuesta de pagos | OK | PARCIAL | FALTA | Selección facturas + umbral dual |
| Aging / saldo proveedor | OK | Stub | FALTA | Consultas + buckets |

### 1.7 CxC

| Funcionalidad | SI/FM | Preview | OpenAPI | Qué acoplar |
|---------------|-------|---------|---------|-------------|
| Facturas cliente | OK | OK lista | FALTA | |
| Cobros / aplicación | OK | PARCIAL | FALTA | |
| Aging / estado de cuenta | OK | Stub | FALTA | Datos demo creíbles + contrato |

### 1.8 Contabilidad

| Funcionalidad | SI/FM | Preview | OpenAPI | Qué acoplar |
|---------------|-------|---------|---------|-------------|
| Plan de cuentas / periodos | OK | OK | **FALTA** `accounting-service` | |
| Asientos guardar/contabilizar | OK+CP | OK líneas | FALTA | Permisos park vs post |
| Mayor / balanza / EEFF | OK | Stub vacío | FALTA | Motor de saldos |
| Multi-moneda ligera | CP OK | **FALTA UI** | FALTA | rate fields en todos los TX |

### 1.9 Tesorería

| Funcionalidad | SI/FM | Preview | OpenAPI | Qué acoplar |
|---------------|-------|---------|---------|-------------|
| Bancos / posición efectivo | OK | OK | **FALTA** `treasury-service` | |
| Órdenes de pago + doble control | CP OK | **FALTA UI dual** | FALTA | TRE ≠ TRE2 |
| Conciliación | OK | PARCIAL | FALTA | |

### 1.10 Controles transversales

| Control | Doc | Preview | Contrato | Qué acoplar |
|---------|-----|---------|----------|-------------|
| `legal_entity_id` | CP/FM §19 | PARCIAL | FALTA en OpenAPI TX | Cabecera obligatoria |
| `document_number` | CP | FALTA | FALTA | Series |
| Crédito | CP | OK | FALTA | |
| Segregación TRE/TRE2 | SF | FALTA | FALTA | Roles + tests SoD |
| Tolerancias match | CP | implícito | FALTA config | |
| Asignación CC | CP | PARCIAL en líneas | FALTA | Enum category |
| Idempotencia | XR/SF | FALTA | PARCIAL WF | Extender a post/pay |
| Auditoría | OK | Stub | OK base | Eventos de negocio ERP |

### 1.11 Tableros / reportes

| Funcionalidad | Estado | Qué acoplar |
|---------------|--------|-------------|
| Dashboard por rol | Preview OK | Definir KPIs canónicos por rol (contrato read-model) |
| Reportes estándar | Stub links | Lista cerrada de reportes MVP + export |

---

## 2. Huecos de arquitectura (ERP vs GRP)

| Tema | Hoy | Debe quedar |
|------|-----|-------------|
| `budget-service` | Ligado a procurement en docs core | **Fuera del camino ERP**; no bloquear OC/pago ERP |
| Gateway modules claim | Mezcla `erp.*` y `grp.*` | Menú/claims ERP-only en rama feat-ERP |
| Servicios faltantes | Solo core + procurement (+ budget GRP) | Inventario, CxP, CxC/Billing, Contabilidad, Tesorería |
| BD compartida | Riesgo si se reusa budget | Una BD por contexto; cero tablas GRP en ERP |

---

## 3. Flujos de trabajo a acoplar

| Proceso Freeze | ¿Existe en WF hoy? | Acción |
|----------------|--------------------|--------|
| PR_APPROVAL | Definir | Alta definición + variables |
| PO_APPROVAL | Probable base | Alinear a umbral SF |
| AP_INVOICE_APPROVAL | FALTA | Alta |
| PAYMENT_DUAL_CONTROL | FALTA | Alta (≠ maker) |
| BANK_CHANGE | FALTA | Alta |
| CREDIT_OVERRIDE | FALTA | Alta |

---

## 4. Catálogos / configuración obligatoria (sin pantalla de usuario)

| Config | Para qué funcionalidad |
|--------|------------------------|
| Series de folio por LE + tipo doc | Todas las TX |
| Umbrales aprobación OC / CxP / dual pago | Compras, CxP, Tesorería |
| Tolerancias qty/importe match | CxP |
| Catálogo impuestos + retenciones MX | Facturación / CxP |
| Moneda funcional por LE + tasas | Multi-moneda |
| Política `gr_based_invoice` STOCK/SERVICE | Compras / CxP |
| Roles Freeze (EMP…TRE2) | Toda la seguridad |

---

## 5. Lista priorizada — acoplar ANTES de desarrollar

### BLOQUEANTES (cerrar primero)

1. **Desacoplar ERP de GRP-budget** en arquitectura y en diseño de procurement (sin commit a fondos públicos).  
2. **Mapa de servicios ERP** congelado: procurement · inventory · ap · ar-billing · accounting · treasury (+ core).  
3. **OpenAPI v0** de esos servicios con cabeceras comunes: `legal_entity_id`, `document_number`, park/post, idempotency.  
4. **Catálogo de eventos** P2P y O2C (nombres + productores/consumidores).  
5. **Repartir Paquete de control** en cada pantalla FM (no solo §19) — checklist por Object Page.  
6. **Definiciones WF** de los 6 procesos Freeze.  
7. **Matriz SoD ejecutable** (casos de prueba): TRE≠TRE2, bank change, park≠post.  
8. **Config de series y umbrales** documentada (seed ACME).

### IMPORTANTES (antes de Angular producto)

9. Completar preview o wireframes: retenciones, dual control, payment_block, FX, folios visibles.  
10. Ficha cliente/proveedor con crédito y hold completos (spec).  
11. EEFF/balanza: contrato de consulta (aunque sea read-model).  
12. Puerto CFDI (interfaz adaptador, sin vendor concreto aún).  
13. Dueño técnico por servicio (checkbox SF §8).

### PUEDEN IR EN PARALELO AL PRIMER SPRINT DE CÓDIGO

14. Seeds de datos ACME.  
15. Casos UAT por rol (guion).  
16. Observabilidad mínima (correlation id ya en core).

---

## 6. Checklist “listo para desarrollar” (Definition of Ready ingeniería)

- [ ] Documento de desacople procurement↔budget GRP aprobado  
- [ ] OpenAPI inventory + ap + ar-billing + accounting + treasury en repo (`shared/openapi/…`)  
- [ ] Eventos P2P/O2C publicados  
- [ ] FM por Object Page incluye columnas CP  
- [ ] 6 procesos WF especificados  
- [ ] Seeds umbrales/series/tax  
- [ ] SoD con casos Given/When/Then  
- [ ] Dueños técnicos asignados  

Cuando el checklist esté en verde → abrir sprint de implementación backend ERP (empezando por procurement alineado al Freeze, sin budget GRP).

---

## 7. Orden sugerido de acoplamiento (trabajo inmediato)

```text
1. Nota ADR: ERP sin budget-service
2. OpenAPI + eventos P2P (PR→PO→GR→AP)
3. OpenAPI Inventory
4. OpenAPI AP + Payment proposal + dual control
5. OpenAPI AR/Billing + crédito
6. OpenAPI Accounting + Treasury
7. Actualizar preview P1 controles faltantes (opcional pero recomendado)
8. Kickoff desarrollo
```

---

**Fin ERP-AC-001**

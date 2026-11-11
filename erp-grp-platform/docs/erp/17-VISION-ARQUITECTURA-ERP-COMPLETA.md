# Visión y arquitectura del Sistema ERP
## ERP-SA-001 — Documento para Arquitectura de Soluciones

| Campo | Valor |
|-------|--------|
| Documento | ERP-SA-001 |
| Audiencia | Arquitecto de Soluciones · Producto · Líderes técnicos |
| Producto | ERP empresarial comercial (capa privada) |
| Piloto de referencia | ACME Industrial (México) |
| Congelamiento MVP | ERP-SF-001 (VoBo 2026-11-07) |
| Separación de producto | **Solo ERP** — sin GRP / presupuesto público (ADR-014) |
| Idioma | Español (identificadores técnicos en inglés) |

---

## 1. Resumen ejecutivo

Se construye un **ERP modular en microservicios** orientado a PyME y empresa mediana en **México**, cubriendo de punta a punta:

- **Compras a pago (P2P):** requisición → orden de compra → recepción → cuentas por pagar → pago
- **Pedido a cobro ligero (O2C):** pedido → entrega → factura / CFDI → cobro
- **Finanzas operativas:** contabilidad, CxP, CxC, facturación, tesorería
- **Inventario básico**
- **Plataforma:** identidad, catálogos, flujos de aprobación, documentos, auditoría

El primer release (**MVP / Freeze**) es operable y controlado: no es un “demo vacío”. Quedan fuera manufactura avanzada, WMS, TMS, nómina profunda, portales y todo el dominio de gobierno (GRP).

**Decisión estructural clave:** el ERP **no** depende de presupuesto público ni de `budget-service`. Las aprobaciones de compra se basan en **flujo de trabajo + umbrales + paquete de control financiero**.

---

## 2. Problema que resuelve

| Problema típico | Cómo lo ataca el producto |
|-----------------|---------------------------|
| Procesos de compra y pago sin control | Bandeja única de aprobación + umbrales + doble control de pagos |
| Facturas vs OC/recepción desalineadas | Match 2-way / 3-way con excepciones |
| Crédito cliente sin freno | Bloqueo duro de crédito en pedidos y CxC |
| Cumplimiento fiscal MX débil | CFDI 4.0, catálogos SAT, RFC, retenciones |
| ERP monolítico difícil de evolucionar | Microservicios + BD por dominio + eventos |
| Mezcla con software de gobierno | Separación explícita ERP ↔ GRP (ADR-014) |

---

## 3. Principios de solución

1. **Congelar alcance antes de ampliar** — lo no listado como DENTRO queda FUERA del release-1.
2. **Un contexto = un servicio = una base de datos** — sin BD compartida entre compras, CxP, CxC, contabilidad, etc.
3. **Login sin elección de rol** — empresa + usuario + contraseña; el administrador asigna módulos y permisos.
4. **UI en español; contratos técnicos en inglés** — estados, APIs y columnas estables (`APPROVED`, `legal_entity_id`).
5. **México primero** — localización fiscal y operativa MVP.
6. **Control antes que velocidad** — park/post, SoD, idempotencia, auditoría before/after.
7. **Eventos para integrar dominios** — no orquestación frágil con FK entre bases.

---

## 4. Arquitectura lógica

```text
Browser (Angular / carcasa HTML actual)
        │
        ▼
 API Gateway  (JWT · rutas · rate limit · tenant)
        │
        ├─────────── Plataforma ───────────┐
        │  IAM · Catálogos · Workflow      │
        │  Documentos · Auditoría          │
        │                                  │
        └─────────── Dominios ERP ─────────┤
           Compras · Inventario · CxP      │
           CxC/Facturación · Contabilidad  │
           Tesorería                       │
                                           │
        Kafka (eventos CloudEvents) ◄──────┘
        PostgreSQL (una BD por servicio)
```

### 4.1 Servicios y bases de datos

| Servicio | Base de datos | Responsabilidad |
|----------|---------------|-----------------|
| `iam-service` | `iam_db` | Usuarios, roles, permisos, organización, sesiones |
| `catalog-service` | `catalog_db` | Catálogos de referencia, series de folio, umbrales, impuestos |
| `workflow-service` | `workflow_db` | Definiciones de proceso, instancias, tareas de aprobación |
| `document-service` | `document_db` | Expedientes y evidencia documental |
| `audit-service` | `audit_db` | Rastro append-only |
| `procurement-service` | `procurement_db` | Proveedores, requisiciones, OC, recepción (lado compras) |
| `inventory-service` | `inventory_db` | Artículos, existencias, movimientos, entregas |
| `ap-service` | `ap_db` | Facturas proveedor, match, propuestas de pago |
| `ar-billing-service` | `ar_db` | Clientes/crédito, pedidos, facturas CFDI, cobros |
| `accounting-service` | `accounting_db` | Plan de cuentas, periodos, asientos, saldos |
| `treasury-service` | `treasury_db` | Bancos, ejecución de pagos, conciliación, efectivo |

**Fuera del track ERP:** `budget-service` (GRP), nómina profunda, portales ciudadano/transparencia.

### 4.2 Dependencias entre dominios

```text
Plataforma (IAM, Catálogo, Workflow, Documento, Auditoría)
    │
    ├── Compras ──► Inventario (recepción)
    │       └──► CxP (referencias OC/GR)
    ├── Inventario ◄── CxC/Facturación (entregas)
    ├── CxP ──► Tesorería (propuesta de pago)
    ├── CxC/Facturación ──► Tesorería (depósitos/cobros)
    ├── Contabilidad ◄── CxP / CxC / Tesorería / Inventario (contabilizaciones)
    └── Tesorería ──► Contabilidad (pagos liquidados)
```

---

## 5. Experiencia de usuario (shell)

| Elemento | Descripción |
|----------|-------------|
| Login | Tres campos: **empresa**, **usuario**, **contraseña** |
| Shell | Barra superior + menú hamburguesa filtrado por permisos |
| Inicio | Saludo, KPIs, pendientes, alertas, lanzador de módulos por área |
| Bandeja | Una sola bandeja para todos los procesos de aprobación |
| Catálogos | Hub administrativo de listas de referencia |
| Navegación | El usuario solo ve módulos autorizados (claims JWT `modules`) |

### Módulos de menú (claims)

| Código | Módulo visible |
|--------|----------------|
| `core.iam` | Usuarios y permisos |
| `core.catalog` | Catálogos |
| `core.workflow` | Bandeja / flujo de trabajo |
| `core.document` | Documentos / expediente |
| `core.audit` | Auditoría |
| `erp.procurement` | Compras |
| `erp.inventory` | Inventarios |
| `erp.ap` | Cuentas por pagar |
| `erp.ar` | Cuentas por cobrar |
| `erp.billing` | Facturación |
| `erp.accounting` | Contabilidad |
| `erp.treasury` | Tesorería |

---

## 6. Mapa de módulos y funciones

### 6.1 Plataforma

| Función | Qué hace | Prioridad |
|---------|----------|-----------|
| Autenticación | Login multi-empresa, JWT, sesión | MVP |
| Administración de usuarios | Alta, baja, bloqueo | MVP |
| Roles y permisos | RBAC; asignación de módulos de menú | MVP |
| Estructura organizacional | Unidades org. / centros de costo / alcance | MVP |
| Catálogos | Listas de referencia operativas + SAT (consulta) | MVP |
| Series de folio | Numeración por entidad legal y tipo de documento | MVP |
| Umbrales / políticas | Montos de aprobación, tolerancias match, dual payment | MVP |
| Bandeja de aprobación | Inbox unificado: aprobar / rechazar / detalle | MVP |
| Definiciones de workflow | Diseñar/activar procesos | Profesional |
| Expediente documental | Adjuntar y consultar evidencia | MVP |
| Auditoría | Consulta before/after por documento | MVP |
| Notificaciones | Centro de avisos | MVP |
| Mi perfil | Preferencias de usuario | MVP |
| Dashboard / reportes | KPIs y exportación estándar | MVP |

### 6.2 Compras (P2P — procurement)

| Función | Descripción | Prioridad |
|---------|-------------|-----------|
| Maestro de proveedores | Alta, RFC, condiciones, banco, bloqueos | MVP |
| Cambio de cuenta bancaria proveedor | Flujo controlado + auditoría SoD | MVP |
| Requisición de compra | Solicitud interna con líneas y monto estimado | MVP |
| Aprobación de requisición | Workflow por umbral | MVP |
| Orden de compra | Emisión a proveedor desde requisición/directa | MVP |
| Aprobación de OC | Workflow compras → gerente → finanzas (umbrales) | MVP |
| Recepción de mercancías/servicios | Entrada parcial o total contra OC | MVP |
| Seguimiento de OC abiertas | Estado, pendiente de recibir | MVP |
| Consultas de compras | Histórico, por proveedor, por comprador | MVP |

**No incluye en MVP:** RFQ avanzado, contratos marco profundos, punch-out, portal proveedor.

### 6.3 Inventarios

| Función | Descripción | Prioridad |
|---------|-------------|-----------|
| Maestro de artículos | STOCK / SERVICE, UoM, costeo | MVP |
| Existencias | On hand, reservado, ATP | MVP |
| Movimientos | Entrada, salida, traspaso, ajuste | MVP |
| Recepción (lado stock) | Impacto de GR en existencias | MVP |
| Entrega / remisión (O2C) | Baja de inventario por pedido | MVP |
| Alertas de stock bajo | Señal operativa | MVP / Profesional |

**No incluye en MVP:** ubicaciones WMS, olas, RF, putaway, valuación compleja avanzada.

### 6.4 Cuentas por pagar (CxP)

| Función | Descripción | Prioridad |
|---------|-------------|-----------|
| Captura de factura proveedor | Cabecera + líneas + impuestos/retenciones | MVP |
| UUID CFDI (condicional) | Si la política de la compañía lo exige | MVP |
| Match OC / recepción / factura | 3-way (STOCK) o 2-way (SERVICE) | MVP |
| Excepción de match | Workflow de resolución | MVP |
| Bloqueo de pago | Impide incluir factura en propuesta | MVP |
| Propuesta / programación de pagos | Selección de facturas a pagar | MVP |
| Antigüedad CxP | Aging y saldo proveedor | MVP |
| Contabilización CxP | Park vs Post hacia contabilidad | MVP |

### 6.5 Cuentas por cobrar y facturación (O2C)

| Función | Descripción | Prioridad |
|---------|-------------|-----------|
| Maestro de clientes | Datos fiscales + límite/bloqueo de crédito | MVP |
| Pedido de venta | Captura y confirmación | MVP |
| Validación de crédito | OK / HOLD / BLOCKED (bloqueo duro) | MVP |
| Excepción de crédito | Workflow de override | MVP |
| Entrega asociada al pedido | Remisión / delivery | MVP |
| Factura cliente | Emisión + timbrado CFDI (puerto fiscal) | MVP |
| Cobro y aplicación | Recibo aplicado a facturas | MVP |
| Antigüedad CxC / estado de cuenta | Consultas | MVP |

**No incluye en MVP:** CPQ, suscripciones, CRM embudo completo, portal cliente.

### 6.6 Contabilidad

| Función | Descripción | Prioridad |
|---------|-------------|-----------|
| Plan de cuentas | Estructura COA | MVP |
| Periodos contables | Abrir / cerrar (con control) | MVP |
| Asientos contables | Captura, guardar, contabilizar, anular/reversar | MVP |
| Mayor / consulta de cuenta | Movimientos | MVP |
| Balanza de comprobación | Cuadre | MVP |
| Estados financieros básicos | P&L / Balance | MVP |
| Contabilizaciones automáticas | Desde CxP, CxC, tesorería, inventario | MVP |

**No incluye en MVP:** consolidación intercompañía, controlling profundo, cierre asistido avanzado.

### 6.7 Tesorería

| Función | Descripción | Prioridad |
|---------|-------------|-----------|
| Cuentas bancarias de la empresa | Maestro de bancos propios | MVP |
| Orden / ejecución de pago | Desde propuesta CxP | MVP |
| Doble control de pagos | Preparador ≠ aprobador sobre umbral | MVP |
| Conciliación bancaria | Extracto vs movimientos | MVP |
| Posición de efectivo | Vista operativa | MVP |

**No incluye en MVP:** coberturas, leasing, cash pooling, deuda compleja.

### 6.8 Catálogos (detalle funcional)

| Grupo | Ejemplos | Modo |
|-------|----------|------|
| Operativos | Monedas, UoM, condiciones de pago, impuestos, tipos de documento, métodos de pago, prioridades, motivos de bloqueo | Editables (admin) |
| Configuración | Series de folio, umbrales de workflow, tolerancias de match | Admin |
| Fiscales SAT | Uso CFDI, forma/método de pago, régimen fiscal, clave prod/serv, etc. | Solo lectura / seed |

**No viven en Catálogos:** proveedores, clientes, artículos, plan de cuentas, bancos de la empresa (son maestros de dominio).

---

## 7. Flujos de trabajo (aprobaciones)

Una sola bandeja atiende estos procesos:

| Proceso | Clave | Disparador | Quién decide |
|---------|-------|------------|--------------|
| Aprobación de requisición | `erp.pr.approve` | Envío de PR | Jefe de área (+ compras si aplica) |
| Aprobación de orden de compra | `erp.po.approve` | Envío de OC | Compras → gerente → finanzas por umbral |
| Excepción de match CxP | `erp.ap.match_exception` | Diferencia fuera de tolerancia | CxP / Controller |
| Doble control de pago | `erp.ap.payment_dual` | Propuesta de pago | Tesorería prepara ≠ aprobador |
| Excepción de crédito | `erp.ar.credit_exception` | Pedido sobre límite / hold | Crédito / Finanzas |
| Cierre de periodo | `erp.gl.period_close` | Solicitud de cierre | Contabilidad con SoD |

Acciones de bandeja: **Aprobar**, **Rechazar** (comentario obligatorio), **Ver detalle / documento**.

---

## 8. Ciclos de negocio y estados

### Compra a pago (P2P)

```text
Requisición → OC → Recepción → Factura CxP → Match → Propuesta pago → Pago → Contabilización
```

### Pedido a cobro (O2C)

```text
Pedido → (crédito) → Confirmación → Entrega → Factura/CFDI → Cobro → Contabilización
```

### Estados canónicos (release-1)

DRAFT · SUBMITTED · PENDING_APPROVAL · APPROVED · REJECTED · SENT · PARTIALLY_RECEIVED · RECEIVED · POSTED · PARTIALLY_PAID · PAID · ISSUED · CONFIRMED · DELIVERED · INVOICED · CREDIT_HOLD · PENDING_DUAL · CLEARED · CLOSED · VOID

---

## 9. Paquete de control (no negociable)

| Control | Descripción |
|---------|-------------|
| Entidad legal | Todo documento transaccional con `legal_entity_id` |
| Folios | Series por compañía y tipo de documento |
| Crédito cliente | Límite + exposición + bloqueo duro |
| Bloqueo proveedor/pago | Hold y payment_block con motivo |
| Doble control de pagos | Maker ≠ checker sobre umbral |
| Cambio de banco proveedor | Flujo + auditoría before/after |
| Tolerancias de match | % precio/cantidad configurables |
| Retenciones | ISR/IVA en factura proveedor |
| CFDI | Emisión en facturación; UUID en CxP según política |
| Park / Post | Guardar ≠ contabilizar |
| Idempotencia | Evitar doble aprobación / pago / posteo |
| Auditoría | Hecho con actor, timestamp, before/after |

### Segregación de funciones (SoD)

1. Quien modifica banco del proveedor ≠ quien aprueba el pago.
2. Ejecutor de tesorería ≠ aprobador del mismo pago.
3. Permisos separados para guardar y contabilizar.
4. Cierre de periodo con control estricto.

---

## 10. Roles del sistema (MVP)

| Código | Rol | Capacidades principales |
|--------|-----|-------------------------|
| EMP | Solicitante | Crear y enviar requisiciones |
| BUY | Comprador | PR→OC, proveedores |
| INV | Almacén | Recepciones, existencias, movimientos |
| SAL | Vendedor | Pedidos, entregas, solicitud de factura |
| AP | Contador CxP | Facturas proveedor, match, propuestas |
| AR | Contador CxC | Facturas cliente, cobros |
| GL | Contador general | Asientos, periodos, COA |
| TRE | Tesorería (ejecutor) | Ejecutar pagos, conciliar |
| TRE2 | Tesorería (aprobador) | Segundo visto en pagos |
| APPR | Aprobador / gerente | Bandeja de aprobaciones |
| ADM | Administrador | Usuarios, roles, catálogos, organización |
| CFO | Director financiero | Lectura ejecutiva + altas aprobaciones |
| AUD | Auditor | Solo lectura de auditoría |
| DG | Dirección general | Tableros / excepciones |

---

## 11. Localización México

| Tema | Alcance MVP |
|------|-------------|
| País | México primero |
| Identificación | RFC en proveedores/clientes |
| Facturación | Emisión CFDI 4.0 (adaptador/puerto) |
| Catálogos SAT | Uso CFDI, forma/método pago, régimen, unidades, impuestos, ClaveProdServ… |
| Retenciones | ISR/IVA en CxP |
| Multi-moneda | Ligera: si moneda ≠ funcional → tipo de cambio y fecha obligatorios |
| Idioma UI | Español |

---

## 12. Lo que queda FUERA del release-1

| Dominio | Ejemplos fuera |
|---------|----------------|
| Manufactura | MRP, BOM, órdenes de fabricación |
| WMS | Ubicaciones, olas, RF |
| TMS | Transporte / flota |
| CPQ / suscripciones | Cotizador avanzado |
| Portales | Proveedor, cliente, empleado avanzado |
| GRP | Presupuesto CONAC, obra pública, transparencia, ciudadano |
| Nómina profunda | IMSS, timbrado nómina, dispersión productiva |
| Activo fijo / proyectos profundos | Solo stubs si aparecen en demos |
| Tesorería avanzada | Coberturas, leasing, cash pooling |
| GRC rico / intercompañía | Consolidación, eliminaciones |

---

## 13. Hoja de ruta por fases

### Fase A — Arranque de plataforma

Login, shell, menú por permisos, catálogos, bandeja (carcasa), auditoría básica.

**Estado actual de carcasa UI:** login, dashboard, bandeja de aprobación y hub de catálogos (operativos + SAT lectura) ya explorables en rama de trabajo de menú/shell.

### Fase B — Dominios ERP

Compras → Inventario → CxP → Tesorería → CxC/Facturación → Contabilidad, con eventos y controles del Freeze.

### Fase C — Profesional (posterior)

Más profundidad operativa (sin abrir aún manufactura/WMS): reportes, workflow designer, cierres asistidos, etc.

### Fase D — Empresarial (posterior)

Manufactura, WMS, TMS, multi-compañía avanzada, GRC, portales.

---

## 14. Stack técnico de referencia

| Capa | Tecnología |
|------|------------|
| Backend | Java 21 · Spring Boot · Spring Cloud Gateway |
| Persistencia | PostgreSQL · Flyway |
| Mensajería | Kafka · CloudEvents |
| Contratos | OpenAPI por servicio |
| Identidad | JWT con tenant, legal entity, modules |
| UI objetivo | Angular (object pages) |
| UI actual (carcasa) | HTML/CSS/JS estático en `iam-service` + kit `dev-preview/` |
| Observabilidad | OpenTelemetry (deshabilitable en perfil local) |

---

## 15. Criterios de éxito del MVP

1. Una empresa puede operar **compra → recepción → factura → pago** con aprobaciones y match.
2. Puede operar **pedido → entrega → factura CFDI → cobro** con control de crédito.
3. Contabilidad recibe posteos y cierra periodos con control.
4. Tesorería ejecuta pagos con doble control cuando aplica.
5. Cada decisión sensible deja **auditoría** e **idempotencia**.
6. El menú y las acciones respetan **permisos por perfil**.
7. **Cero dependencia** de presupuesto GRP.

---

## 16. Documentación de soporte

| Documento | Contenido |
|-----------|-----------|
| ERP-SF-001 | Congelamiento de alcance MVP |
| ERP-SI-001 | Inventario de pantallas |
| ERP-FM-001 | Matriz de campos y reglas |
| ERP-CP-001 | Paquete de control |
| ERP-MS-001 | Mapa de servicios |
| ERP-EV-001 | Catálogo de eventos |
| ERP-WF-001 | Definiciones de workflow |
| ERP-SOD-001 | Casos de segregación de funciones |
| ERP-CFG-001 | Seed ACME |
| ERP-CAT-001 | Catálogos configurables |
| ERP-ARCH-DIAG-001 | Diagramas por fases |
| ADR-014 | ERP sin budget/GRP |
| ERP-DB-BRIEF-001 | Briefing técnico para diseño modular de BD |

Índice general: `docs/erp/00-INDEX.md`.

---

## 17. Conclusión para Arquitectura de Soluciones

El sistema buscado es un **ERP comercial mexicano, modular y controlado**, no una suite SAP completa ni un ERP de gobierno. El valor del MVP está en cerrar **P2P + O2C ligero + finanzas operativas** sobre una plataforma de identidad, catálogos, workflow, documentos y auditoría, con microservicios y bases separadas por dominio.

La decisión de **excluir budget/GRP** no es un detalle: define límites de contexto, contratos, eventos y modelo de datos. Cualquier diseño de solución (BD, APIs, UI, integraciones fiscales) debe partir de ese Freeze.

---

**Fin ERP-SA-001**

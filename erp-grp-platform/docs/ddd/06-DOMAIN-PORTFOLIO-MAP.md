# 6. Domain Portfolio Map — ERP + GRP
## DDD-PORT-001

| Campo | Valor |
|-------|--------|
| Documento | DDD-PORT-001 |
| Tipo | Domain Portfolio Map |
| Entradas | DDD-001 · SA-MS-001 · EA-DEC-001 · SF-001 · inventario ERP/GRP (SAP, Oracle, D365, K2B, CONAC/SAACG) |
| Estado | Aprobado para alineación de producto / arquitectura |
| Piloto | Gobierno Municipal · multi-tenant capable |

---

## 0. Propósito

Mapear **todos** los dominios de una suite ERP+GRP completa, clasificarlos con DDD, fijar fronteras de bounded context, dependencias, riesgos de acoplamiento y la **estrategia de evolución** desde el MVP actual hasta la suite.

Este documento **no inventa contratos de API**. Extiende el lenguaje y fronteras ya definidos en DDD-001 / SA-MS-001.

---

## 1. Dominios compartidos ERP / GRP

Dominios cuyo **concepto de negocio existe en ambos mundos**, aunque el lenguaje y las invariantes cambien por sector (ACL obligatorio).

| Dominio | Lenguaje compartido (núcleo) | Variante ERP | Variante GRP | BC propuesto |
|---------|------------------------------|--------------|--------------|--------------|
| Identity & Access | Usuario, Rol, Sesión, Permiso | Empleado/portal | Funcionario + OrgScope | Identity & Access |
| Organization | Unidad, Jerarquía, Puesto | CC / BU | Dependencia / plaza | Organization Structure |
| Catalog / Master Data | Código, Ítem, Vigencia | SKU, Incoterms | Clasificadores, DOC_TYPE | Catalog |
| Workflow / Approvals | Proceso, Tarea, Decisión | Aprobación comercial | Cadena administrativa | Workflow |
| Document / Case File | Documento, Versión, Expediente | Anexo comercial | Expediente electrónico | Document Management |
| Audit / Trail | Hecho, Actor, Antes/Después | SOX / interno | Órgano de control | Audit |
| Notification | Aviso, Canal, Plantilla | Email comercial | Oficio / ciudadano | Notification |
| Procurement (ejecución) | Requisición, OC, Recepción | P2P privado | Ejecución post-adjudicación | Purchasing |
| Payables (CxP) | Factura proveedor, Obligación, Pago | AP comercial | Egreso / CxP gubernamental | Accounts Payable |
| Receivables (CxC) | Factura/cargo, Saldo, Cobro | AR comercial | Documento por cobrar / recaudación | Accounts Receivable |
| Billing / Invoicing | Comprobante de cobro | Factura venta / suscripción | CFDI / comprobante de derechos | Billing |
| Treasury / Cash | Banco, Orden de pago, Conciliación | Cash mgmt | Tesorería pública | Treasury |
| Accounting / GL | Cuenta, Asiento, Periodo | NIIF / comercial | CONAC / armonizada | Accounting |
| Fixed Assets / Patrimonio | Activo, Alta, Baja, Depreciación | Capex privado | Bienes muebles/inmuebles | Fixed Assets |
| Inventory | Existencia, Movimiento | Stock comercial | Almacén / bienes de consumo | Inventory |
| Human Resources | Persona, Plaza, Movimiento | Empleado | Servidor público / plaza presupuestal | Human Resources |
| Payroll | Corrida, Recibo | Nómina privada | Nómina pública | Payroll |
| Projects | Proyecto, Costo, Avance | PSA / PPM | Programa / obra (parcial) | Projects |
| Analytics / Reporting | KPI, Cubo, Tablero | BI gerencial | Transparencia / Cuenta Pública (consumo) | Analytics |

**Justificación DDD:** son *Shared Kernel* conceptual **solo a nivel de capacidad de plataforma**. En runtime **no** deben compartir el mismo aggregate ni la misma DB entre variante ERP y GRP: el lenguaje diverge (Invoice vs Liquidación; Commitment vs Sales Order). La integración es **Customer/Supplier + ACL**, no Shared Kernel de código de dominio.

---

## 2. Dominios exclusivos ERP

| Dominio | Lenguaje ubicuo | Por qué no es GRP | BC |
|---------|-----------------|-------------------|-----|
| CRM / Sales | Lead, Oportunidad, Cuenta, Pipeline | Gobierno no “vende” en sentido comercial; el análogo es trámite/ciudadano | CRM |
| Order-to-Cash (pedidos) | Sales Order, Delivery, Billing | Ciclo comercial B2B/B2C | Sales & Distribution |
| Manufacturing / MRP | BOM, Orden de producción, MRP | Fuera del objeto municipal típico | Manufacturing |
| Quality Management | Inspección, No conformidad | Planta / proveedor industrial | Quality |
| Plant Maintenance / EAM industrial | Orden de mantenimiento de planta | Distinto de patrimonio administrativo | Asset Maintenance (industrial) |
| Warehouse Management (WMS) | Bin, Pick, Put-away | Complejidad logística privada; municipio usa Inventory light | Warehouse |
| Transportation / TMS | Ruta, Embarque, Flete | Logística comercial | Transportation |
| SRM estratégico avanzado | Scorecard proveedor, category mgmt | Solapable con compras públicas, pero framework privado | Supplier Management |
| E‑commerce / CPQ / Subscriptions | Carrito, Configure-Price-Quote | No aplica a ente público | Commerce |
| Controlling / Management Accounting | Centro de costo, margen, CO-PA | Analítica de rentabilidad; GRP usa clasificadores programáticos | Controlling |
| EPM corporativo | Forecast, consolidación holding | Distinto de presupuesto público jurídico | Enterprise Performance |

---

## 3. Dominios exclusivos GRP

| Dominio | Lenguaje ubicuo | Por qué no es ERP | BC |
|---------|-----------------|-------------------|-----|
| Public Budget / Funds Control | Partida, Clave, Compromiso, Devengado, Ejercido, Modificado | Presupuesto = norma jurídica, no guía | Public Budget |
| Public Procurement (adjudicación) | Procedimiento, Licitación, Fallo, Contrato marco | Derecho administrativo de contrataciones | Public Procurement |
| Tax & Collection / Ingresos | Contribuyente, Padrón, Liquidación, Rezago | Ingresos de potestad pública | Tax & Collection |
| Citizen Services | Trámite, Cita, Ventanilla, Expediente ciudadano | Identidad y journey distintos al funcionario | Citizen Services |
| Social Programs | Beneficiario, Padrón, Dispersión, Elegibilidad | Transferencias condicionadas | Social Programs |
| Public Works (Obra) | Contrato de obra, Estimación, Bitácora, Retención | LOPSRM / bitácora electrónica | Public Works |
| Transparency | Obligación de transparencia, Publicación, Datos abiertos | Cumplimiento proactivo/reactivo | Transparency |
| Oversight / Fiscalización | Hallazgo, Observación, Remediación, Cuenta Pública | Órganos de control | Oversight |
| Government Accounting Close | Estados CONAC, EAI, EAEPE, MIR | Armonización contable / ASF | Gov Reporting (parte de Accounting+Budget+Transparency) |
| Correspondence / Official Acts | Oficio, Acuerdo, Firma electrónica institucional | Acto administrativo | Official Correspondence |

---

## 4. Bounded Contexts propuestos (portfolio completo)

### 4.1 Diagrama lógico

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         PLATFORM (Core)                              │
│  IAM · Organization · Catalog · Workflow · Document · Audit · Ntf   │
│  Tenant/Config · Gateway · Observability                             │
└──────────────────────────────────────────────────────────────────────┘
                 ▲ upstream (nunca depende de ERP/GRP)
┌────────────────────────────┬─────────────────────────────────────────┐
│     SHARED BUSINESS        │                                         │
│  Purchasing · AP · AR      │                                         │
│  Billing · Treasury        │                                         │
│  Accounting · FA · Inv     │                                         │
│  HR · Payroll · Projects   │                                         │
└───────────────┬────────────┴─────────────────────────────────────────┘
                │ ACL / Events
     ┌──────────┴──────────┐
     ▼                     ▼
┌──────────────┐   ┌──────────────────────────────┐
│ ERP ONLY     │   │ GRP ONLY                     │
│ CRM · Sales  │   │ Public Budget · Pub. Procure │
│ Mfg · WMS    │   │ Tax · Citizen · Social       │
│ TMS · CPQ    │   │ Public Works · Transparency  │
│ Controlling  │   │ Oversight · Correspondence   │
└──────────────┘   └──────────────────────────────┘
```

### 4.2 Catálogo de BCs (1 BC ≈ 1 servicio aspiracional)

| # | Bounded Context | Capa portfolio | Servicio canónico (SA-MS) | Fase |
|---|-----------------|----------------|---------------------------|------|
| 1 | Identity & Access | Plataforma | `iam-service` | MVP |
| 2 | Organization Structure | Plataforma / Soporte | (hoy en IAM+Catalog; futuro `org-service`) | MVP parcial → F2 |
| 3 | Catalog | Plataforma | `catalog-service` | MVP |
| 4 | Workflow | Plataforma | `workflow-service` | MVP |
| 5 | Document Management | Plataforma | `document-service` | MVP |
| 6 | Audit | Plataforma | `audit-service` | MVP |
| 7 | Notification | Plataforma / Soporte | `notification-service` | MVP-A |
| 8 | Tenant Configuration | Plataforma | control-plane / flags | MVP mín. |
| 9 | Purchasing | Compartido | `procurement-service` | MVP |
| 10 | Public Budget | Especializado GRP | `budget-service` | MVP |
| 11 | Accounts Payable | Compartido | `ap-service` (nuevo) | F2 |
| 12 | Accounts Receivable | Compartido | `ar-service` (nuevo) | F2/F3 |
| 13 | Billing | Compartido | `billing-service` (nuevo) | F2/F3 |
| 14 | Treasury | Compartido | `treasury-service` | F1/F2 |
| 15 | Accounting | Compartido | `accounting-service` | F1/F2 |
| 16 | Fixed Assets | Compartido | `asset-service` | F2+ |
| 17 | Inventory | Compartido / ERP-lean | `inventory-service` | F2+ |
| 18 | Human Resources | Compartido | `hr-service` | F2+ |
| 19 | Payroll | Compartido | `payroll-service` | OUT-F1 → F3 |
| 20 | Projects | Compartido | `project-service` | F2+ |
| 21 | Public Procurement | Especializado GRP | `public-procurement-service` | F2+ |
| 22 | Tax & Collection | Especializado GRP | `tax-service` | OUT-F1 → F3 |
| 23 | Citizen Services | Especializado GRP | `citizen-service` | OUT-F1 → F3 |
| 24 | Social Programs | Especializado GRP | `social-program-service` | OUT-F1 |
| 25 | Public Works | Especializado GRP | `public-works-service` | F2+ |
| 26 | Transparency | Especializado GRP | `transparency-service` | F2+ |
| 27 | Oversight | Especializado GRP | `oversight-service` | F2+ |
| 28 | CRM | Especializado ERP | `crm-service` | F3 / privado |
| 29 | Sales | Especializado ERP | `sales-service` | F3 / privado |
| 30 | Manufacturing | Especializado ERP | `manufacturing-service` | Bajo demanda |
| 31 | Warehouse | Especializado ERP | `wms-service` | Bajo demanda |
| 32 | Analytics | Soporte | `analytics` / lakehouse | Transversal |

---

## 5. Dependencias (dirección permitida)

### 5.1 Reglas

1. **Platform Core no depende de ERP/GRP** (SA-MS-001).  
2. **GRP Budget es autoridad de saldos**; Purchasing/AP/Payroll/Works *preguntan* o *comanditan* commit — no duplican saldo.  
3. **Accounting es autoridad de asientos**; nadie escribe pólizas fuera de `accounting-service`.  
4. **Treasury es autoridad de movimiento de dinero**; AP/AR/Payroll emiten *solicitudes de pago/cobro*.  
5. **Document/Workflow/Audit** son *generic subdomains* consumidos por todos.  
6. Sync solo para invariante inmediata (ej. `CommitBudget`); resto eventos.

### 5.2 Dependencias críticas (MVP → F2)

```text
Purchasing ──sync──► Budget (CommitBudget)
Purchasing ──async─► Document, Audit, Workflow, Notification
AP ──async──► Purchasing (OC/Recepción), Document (CFDI), Audit
AP ──sync/async──► Budget (devengado/ejercido) + Treasury (orden de pago)
AR/Billing ──async──► Tax/Citizen (GRP) o Sales (ERP)
Treasury ──async──► Accounting, Budget, Audit
Payroll ──► Budget + Treasury + Accounting
Public Procurement ──► Budget + Purchasing + Document + Transparency
Public Works ──► Budget + AP + Document + Fixed Assets
```

### 5.3 Mapa de relaciones DDD

| Relación | Patrón | Ejemplo |
|----------|--------|---------|
| Core → Business | Open Host Service | IAM JWT, Catalog codes |
| Purchasing ↔ Budget | Customer/Supplier + ACL | OC ↔ Partida/Compromiso |
| Purchasing ↔ Public Procurement | Separate Ways → luego Conformist light | Adjudicación ≠ ejecución |
| AP ↔ Accounting | Published Language (events) | `VendorInvoicePosted` |
| AR ↔ Billing | Shared Kernel controlado *o* merge | Si CFDI vive en Billing, AR solo saldos |
| Citizen ↔ IAM | Anticorruption | Ciudadano ≠ funcionario |
| Transparency ← Budget/Procurement | Conformist de lectura | Publicación no muta fondos |

---

## 6. Riesgos de acoplamiento

| Riesgo | Síntoma | Mitigación DDD |
|--------|---------|----------------|
| **God Finance DB** | GL+AP+AR+Budget+Treasury en una sola base “porque es dinero” | Separar BC: Budget ≠ Accounting ≠ Treasury ≠ AP/AR |
| **Purchasing escribe partidas** | Update directo a tabla de presupuesto | Solo comando `CommitBudget` / eventos; DB-per-service |
| **Workflow embebido en cada módulo** | 7 motores de aprobación | Un solo BC Workflow |
| **Document blobs en OC** | Binarios en `procurement_db` | Solo refs a `document-service` |
| **CFDI dentro de Purchasing** | Timbrado mezcla P2P con fiscal | Billing/AP como BC fiscal |
| **ERP Invoice = GRP Liquidación** sin ACL | Modelo único forzado | Dos modelos + traductor |
| **Citizen Identity = IAM employee** | Roles cruzados inseguros | Contextos de identidad distintos |
| **Shared DB “temporal”** | FK cross-service “por velocidad” | Prohibido (SA-MS-001 §1.3) |
| **Saga distribuida demasiado ancha** | P2P+CFDI+banco+CONAC en un solo orquestador | Sagas por etapa; outbox; compensaciones locales |
| **UI monolítica dicta servicios** | Un formulario crea 5 aggregates sin límites | Object page orquesta APIs; no fusiona DBs |

---

## 7. Servicios que deberían vivir juntos

*(mismo proceso / mismo deploy **solo** si el lenguaje y el ciclo de cambio coinciden; preferencia: modular monolith **dentro** del BC, no cross-BC)*

| Agrupación permitida | Qué incluye | Justificación DDD |
|----------------------|-------------|-------------------|
| **IAM + Org mínima (MVP)** | Usuarios, roles, OU scopes | Un solo modelo de identidad del funcionario en el piloto |
| **Billing + AR (opción F2)** | Emisión de comprobante + saldo | Misma raíz: el documento de cobro *crea* el receivable; Shared Kernel estrecho |
| **AP + Invoice capture (opción)** | Registro factura proveedor + obligación | Un aggregate VendorInvoice |
| **HR + Payroll (opción temprana)** | Si el equipo es uno y el volumen bajo | Cuidado: en madurez **separar** (payroll es subdominio crítico) |
| **Notification + templates** | Un solo servicio de canales | Generic subdomain |
| **Catalog + reference data** | Un BC de maestros | Evita N micro-catálogos |

**No** “vivir juntos” significa compartir **código de dominio y DB**. Pueden compartir *cluster*, *pipeline* o *librerías* (`common-*`) sin fusionar aggregates.

---

## 8. Servicios que **jamás** deberían compartir base de datos

| Par (o grupo) | Por qué |
|---------------|---------|
| **Budget ↔ Accounting** | Funds control ≠ libro patrimonial (FM vs FI) |
| **Budget ↔ Purchasing** | Partida/saldo ≠ líneas de OC |
| **Budget ↔ Treasury** | Autorización de fondos ≠ movimiento bancario |
| **Purchasing ↔ AP** | Orden/recepción ≠ obligación/factura (momentos distintos) |
| **AP ↔ AR** | Pasivo vs activo; ciclos y roles opuestos |
| **Billing/CFDI ↔ Purchasing** | Fiscalidad ≠ abastecimiento |
| **IAM ↔ cualquier negocio** | Credenciales/sesiones ≠ datos de negocio |
| **Audit ↔ origen mutador** | Trail inmutable; escritura append-only separada |
| **Document (blobs/meta) ↔ negocio** | Retención, malware, versionado distintos |
| **Workflow ↔ negocio** | Definiciones de proceso genéricas |
| **Citizen ↔ IAM funcionario** | Sujetos legales distintos |
| **Tax/Collection ↔ AR comercial** (si ambos existen) | Potestad tributaria ≠ crédito mercantil — ACL, no DB |
| **Payroll ↔ Treasury** | Cálculo ≠ instrucción de pago (aunque se integren) |
| **Public Works ↔ Fixed Assets** hasta capitalización | Obra en proceso ≠ activo capitalizado |

Regla operativa: **Database per Bounded Context** (SA-MS-001). Referencias por ID + eventos.

---

## 9. Domain Portfolio Map (vista de capas)

### 9.1 Plataforma

| Dominio | Tipo DDD | Justificación |
|---------|----------|---------------|
| IAM | Generic subdomain → Supporting | Habilita todos los BC; no genera ventaja competitiva municipal pero es invariante de seguridad |
| Tenant / Config | Supporting | Control plane multi-tenant |
| Gateway / Observability | Infrastructure | No es dominio de negocio |

### 9.2 Dominios Core (Core Domain del piloto municipal)

Para **este** producto en el piloto, el core domain competitivo es:

| Dominio | Justificación |
|---------|---------------|
| **Public Budget** | Diferenciador GRP: control previo de fondos |
| **Purchasing (P2P ejecución)** | Cadena de valor del happy path municipal |
| **Workflow** | Decisiones humanas trazables (aunque genérico, es crítico al valor) |
| **Document** | Evidencia y expediente como sistema de record |
| **Audit** | Cumplimiento y confianza ante contraloría |

> En DDD clásico Workflow/Document son *generic*; aquí se elevan a **core del producto** porque el piloto se vende como “compra pública controlada y auditable”, no como CRM.

### 9.3 Dominios Soporte (Supporting)

| Dominio | Justificación |
|---------|---------------|
| Catalog | Maestros; sin ellos no hay consistencia, pero no son el diferenciador |
| Organization | Estructura; soporte a OrgScope y reportes |
| Notification | Side-effect de comunicación |
| Analytics | Lectura; no posee invariantes transaccionales |

### 9.4 Dominios Compartidos (ERP ∩ GRP)

Purchasing · AP · AR · Billing · Treasury · Accounting · Fixed Assets · Inventory · HR · Payroll · Projects  

**Justificación:** capacidad reusable; **implementación** con políticas/ACL por `tenant_type` (GOV vs PRIVATE), no con una sola tabla “inteligente” que mezcle liquidación tributaria y factura comercial.

### 9.5 Dominios Especializados ERP

CRM · Sales · Manufacturing · WMS · TMS · Commerce/CPQ · Controlling · EPM  

**Justificación:** lenguaje y procesos de mercado; se activan cuando el tenant es empresa privada o cuando un organismo opera una empresa paramunicipal con contabilidad comercial.

### 9.6 Dominios Especializados GRP

Public Budget* · Public Procurement · Tax & Collection · Citizen · Social · Public Works · Transparency · Oversight · Official Correspondence  

\*Public Budget ya es Core del piloto; permanece listado aquí como especialización sectorial.

---

## 10. Estrategia de evolución MVP → suite completa

### Oleada 0 — Foundation (hecho / en curso)
`iam · catalog · audit · workflow · document · (notification)`  
+ arquetipo técnico, gateway, tenancy RLS.

### Oleada 1 — Spine de valor municipal (**MVP congelado**)
`budget · procurement` + saga PurchaseApproval  
Demo: SC → WF → CommitBudget → OC → (recepción/pago light).

### Oleada 2 — Cierre financiero operativo
1. **AP (CxP)** — desacoplar “Pago” genérico del P2P  
2. **Treasury** — órdenes de pago / bancos  
3. **Accounting light** — asientos desde eventos AP/Treasury/Budget  
4. **Billing + AR** — solo si el piloto recauda o factura derechos  
Congelar DoR/OpenAPI/ERD **antes** de código (ver checklist previo).

### Oleada 3 — GRP extendido
Public Procurement · Public Works · Fixed Assets/Patrimonio · Transparency · Oversight (Cuenta Pública).

### Oleada 4 — Personas e ingresos profundos
HR · Payroll · Tax & Collection · Citizen · Social (los OUT-F1 originales).

### Oleada 5 — Suite privada / full ERP
CRM · Sales · Inventory/WMS · Manufacturing · bajo demanda de tenants privados.

### Principios de evolución

1. **Nunca romper Core:** nuevos BC solo *downstream* vía eventos/ACL.  
2. **Strangler por BC:** reemplazar “pago light” en procurement por AP sin big-bang.  
3. **Feature flags por módulo + tenant** (`modules` claim JWT).  
4. **Un BC nuevo = Freeze + DoR + OpenAPI + Events + Flyway** antes de coding.  
5. **Preferir sacar servicio** cuando el lenguaje diverja (AP vs Purchasing) aunque al inicio fuera pantalla del mismo menú.

```text
MVP spine          F2 finance           F3 GRP deep         F4 ERP private
─────────          ──────────           ──────────          ────────────
IAM Catalog        AP Treasury          Pub.Procurement     CRM Sales
Audit WF Doc       Accounting           Works Assets        WMS/Mfg
Budget Procure     Billing/AR*          Tax Citizen         Commerce
                   *si hay recaudación  Transparency
```

---

## 11. Matriz de decisión rápida (¿juntos o separados?)

| Pregunta | Si “sí” → |
|----------|-----------|
| ¿Cambian en el mismo sprint y el mismo equipo siempre? | Candidatos a modular monolith **dentro** de un BC |
| ¿El lenguaje ubicuo es distinto (Partida vs OC vs Póliza)? | **Separar BC y DB** |
| ¿Una falla de A no debe tumbar B? | Separar deploy |
| ¿Hay invariante síncrona entre A y B? | API sync + timeout + idempotencia; **igual DB separada** |
| ¿Solo lectura para reporting? | Réplica / analytics; no DB compartida de escritura |

---

## 12. Relación con documentos vigentes

| Documento | Relación |
|-----------|----------|
| DDD-001 §4 Bounded Contexts | Este portfolio **amplía** el catálogo; no invalida MVP |
| SA-MS-001 | Mantiene 1 BC ≈ 1 servicio y DB-per-service |
| SF-001 / EA-DEC-001 | Oleada 1 = freeze actual; Oleadas 2+ requieren nuevo freeze |
| ARCH-MVP-001 | Scaffold solo de Oleada 1 |

---

## 13. Conclusión ejecutiva

- **Compartido ERP/GRP:** plataforma + finanzas operativas (P2P, AP, AR, Billing, Treasury, GL, FA, HR…).  
- **Solo ERP:** CRM, ventas, manufactura, WMS/TMS, commerce.  
- **Solo GRP:** presupuesto público, contratación administrativa, ingresos/potestad, ciudadano, obra, transparencia, fiscalización.  
- **Core del piloto:** Budget + Purchasing + Workflow + Document + Audit (sobre Platform).  
- **Jamás misma DB:** Budget↔Accounting↔Purchasing↔AP↔AR↔IAM↔Audit↔Documents.  
- **Evolución:** spine MVP → CxP/Tesorería/GL → GRP profundo → ERP privado.

**Siguiente paso de producto:** Scope Freeze Oleada 2 (AP · Treasury · Accounting light · opcional Billing/AR) con DoR completo antes de desarrollo.

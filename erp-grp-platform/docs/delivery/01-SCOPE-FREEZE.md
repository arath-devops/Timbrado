# 1. Scope Freeze Document
## DEL-S1-001 · SF-001

| Campo | Valor |
|-------|--------|
| Documento | SF-001 |
| Tipo | Scope Freeze |
| Estado | **Congelado** |
| Vigencia | Sprint 1 (construcción inicial MVP spine) |
| Aprobadores requeridos | Product Owner · CTO · Enterprise Architect · Delivery Manager |
| Fuente de verdad de servicios | SA-MS-001 |
| Fuente de verdad de negocio | EA-DEC-001 |

---

## 1.1 Propósito

Congelar el alcance del **primer ciclo de construcción** del piloto municipal para evitar inflación de scope, ambigüedad entre Core y valor municipal, y trabajo paralelo no integrable.

Este freeze **no** redefine el MVP completo de EA-DEC-001: lo **acota** a un primer baseline entregable y verificable (Sprint 1), manteniendo los criterios de aceptación globales del MVP como horizonte.

---

## 1.2 Alcance congelado (IN)

### Segmento y runtime
| Ítem | Valor congelado |
|------|-----------------|
| Segmento piloto | Gobierno Municipal |
| Tenancy de plataforma | Multi-tenant **by design** |
| Runtime del piloto | **Tenant dedicado** (sin co-location de datos sensibles) |
| Moneda operativa | MXN |
| Idioma UI/API errores | Español (mensajes), códigos técnicos en inglés estable |

### Módulos incluidos (nombres canónicos SA-MS-001)
| Módulo de negocio | Servicio | Rol en Sprint 1 |
|-------------------|----------|-----------------|
| IAM | `iam-service` | Autenticación, usuarios, roles, OrgScope básico, JWT |
| Catálogos | `catalog-service` | Maestros municipales mínimos versionados |
| Auditoría | `audit-service` | Ingesta y consulta de hechos de mutación |
| Workflow | `workflow-service` | Motor + proceso `PO_APPROVAL` (y submit de requisición si aplica) |
| Documentos | `document-service` | Case file + upload + vínculo a transacción |
| Compras | `procurement-service` | Requisición → OC (borrador/submit/approve/cancel base) |
| Presupuesto | `budget-service` | Ciclo/partida, disponibilidad, commit/release |

### Happy path congelado (único camino de valor Sprint 1)

```text
Login municipal
  → Catálogos sembrados (OU, partidas/rubros, proveedor básico)
  → Crear Requisición / OC ligada a partida
  → Adjuntar documento al expediente
  → Enviar a Workflow (PO_APPROVAL)
  → CommitBudget sync (Idempotency-Key)
  → Aprobar OC solo si COMMITTED
  → AuditFact en cada mutación relevante
```

Cualquier otro flujo (recepción, factura, 3-way match, modificación presupuestal compleja, pagos) **queda fuera** del freeze de Sprint 1 aunque forme parte del MVP ampliado o de F1.

---

## 1.3 Funcionalidades incluidas

### IAM
- Alta/consulta de usuarios del tenant piloto
- Asignación de roles municipales mínimos (ver Baseline)
- Emisión/validación JWT con claims: `sub`, `tenant_id`, `roles`, `org_scopes`, `modules`, `sid`
- `GET /me` y `GET /me/menus` (árbol mínimo)
- Lock de usuario
- OrgScope básico tipo `OU_SUBTREE` (una unidad o subtítulo)

### Catalog
- CRUD de catálogos maestros del piloto (lista cerrada en Baseline)
- Versionado simple / estado activo-inactivo
- Consulta por código para consumidores (procurement, budget)

### Audit
- Ingesta de `AuditFact` (API M2M y/o bridge outbox)
- Consulta por `entityType` + `entityId` + rango temporal
- Inmutabilidad lógica (append-only)

### Workflow
- Definición desplegable `PO_APPROVAL`
- Start process con `businessRef`
- Tareas humanas approve/reject
- Eventos `ProcessCompleted` / `ProcessRejected` / `ProcessCancelled`
- Candidate assignment por rol (sin motor de reglas avanzado)

### Document
- Crear case file
- Upload de documento (binario a object storage)
- Vincular documento a agregado de negocio (`DocumentLinked`)
- Descarga por autorizado
- Checklist mínimo opcional como guard BPM (si/no documentos requeridos)

### Procurement
- Crear/consultar requisición
- Crear/consultar OC
- Submit OC → inicia WF + prepara commit presupuestal
- Approve solo tras `COMMITTED` (o rechazo/regreso a borrador si `INSUFFICIENT_FUNDS`)
- Cancel OC → `release` de compromiso
- Referencia a `allocationId`, `caseFileId`, montos MXN

### Budget
- Ciclo presupuestal básico (crear/activar para piloto)
- Allocations (partidas) con monto autorizado
- `GET /availability`
- `POST /movements/commit` (sync, idempotente)
- `POST /movements/release`
- Eventos `BudgetCommitted` / `BudgetCommitFailed` / `BudgetCommitmentReleased`
- Invariante: authorized ≥ committed (≥ accrued/paid diferidos)

---

## 1.4 Funcionalidades excluidas (OUT — Sprint 1)

| Excluido | Motivo |
|----------|--------|
| MFA / step-up / SSO federado completo | SEC-ARCH completo; post Sprint 1 |
| ABAC de monto fino + SoD exhaustivo | Matriz SEC; usar RBAC+OrgScope mínimo |
| OCR, QR, firma electrónica avanzada, retención legal completa | EDM maduro; Sprint 1 = upload+link |
| SLA automático / escalamiento BPM | BPM-001 diferido |
| Recepción de bienes, factura, 3-way match | Post-MVP drop / F1 |
| Devengado / pagado presupuestal | Momentos posteriores al commit |
| Modificaciones presupuestales complejas / congelamiento avanzado | F1 |
| Contabilidad, tesorería, inventarios, RH, nómina | Fuera MVP o OUT-F1 |
| Ciudadanía, recaudación, programas sociales, transparencia producto | OUT-F1 (EA-DEC) |
| BI / IA | OUT-F1 |
| Portal ciudadano / app móvil | Fuera |
| Multi-tenant compartido en el mismo data plane del piloto | Runtime = dedicado |
| Contrataciones públicas / licitaciones | Futuro `public-procurement-service` |
| Notification-service como producto completo | Se permite stub/log o envío diferido; no bloquea DoD Sprint 1 |
| UI Angular completa de los 7 módulos | Sprint 1 prioriza APIs integrables; UI mínima opcional (smoke) |
| Migración masiva de datos históricos municipales | Solo seed controlado |

> **Regla de freeze:** si no está en §1.3, **no se construye** en Sprint 1 sin Change Request.

---

## 1.5 Dependencias entre módulos

### Orden de habilitación (obligatorio)

```text
1. iam-service
2. audit-service + catalog-service   (pueden paralelizarse tras IAM JWT)
3. workflow-service + document-service
4. budget-service
5. procurement-service               (último: consume todos)
```

### Matriz de dependencia (Sprint 1)

| Consumidor | Depende de | Tipo | Contrato crítico |
|------------|------------|------|------------------|
| Todos | iam-service | Sync JWT/JWKS | Claims `tenant_id` |
| Todos (mutaciones) | audit-service | Async/API | `AuditFact` |
| budget, procurement | catalog-service | Sync read | Códigos maestros |
| procurement | workflow-service | Sync start + events | `PO_APPROVAL` |
| procurement, budget | document-service | Sync + events | case file / link |
| **procurement** | **budget-service** | **Sync command** | **CommitBudget / Release** |
| workflow | iam (roles) | Sync/claims | Candidatos |
| document | iam | Sync | Autorización descarga |

### Anti-dependencias (congeladas)
- Core no depende de ERP/GRP en compile-time.
- `procurement` no escribe `budget_db`.
- `budget` no escribe `procurement_db`.
- Ningún servicio envía SMTP propio (notification diferido o stub centralizado).
- Binarios solo vía `document-service`.

---

## 1.6 Riesgos

| ID | Riesgo | Impacto | Prob. | Mitigación de freeze |
|----|--------|---------|-------|----------------------|
| R-S1-01 | MVP de 7 módulos sobrecarga el sprint | Alto | Alta | Baseline limita happy path único; UI no obligatoria |
| R-S1-02 | CommitBudget mal implementado (doble compromiso / sin idempotencia) | Crítico | Media | Contrato sync + Idempotency-Key obligatorio en DoR |
| R-S1-03 | IAM “completo” se cuela (MFA/SSO) | Alto | Media | Exclusión explícita §1.4 |
| R-S1-04 | Contratos OpenAPI/eventos incompletos al día 1 de coding | Alto | Alta | DoR exige contratos mínimos por módulo antes de DEV |
| R-S1-05 | Datos maestros municipales no disponibles a tiempo | Alto | Media | Seed sintético aprobado por PO si el municipio no entrega |
| R-S1-06 | Ambigüedad purchasing vs procurement (naming legacy) | Medio | Media | Nombre canónico: `procurement-service` (P2P) |
| R-S1-07 | Scope creep de recepción/factura “porque es P2P” | Alto | Alta | Excluido en freeze; CR obligatorio |
| R-S1-08 | Tenant dedicado mal aislado pese a diseño multi-tenant | Alto | Baja | Checklist tenancy en DoR técnico |

---

## 1.7 Supuestos

| ID | Supuesto |
|----|----------|
| A-01 | Existe (o se define) un tenant piloto único con UUID estable. |
| A-02 | El municipio piloto acepta roles mínimos del Baseline (Capturista, Jefe, Director, Auditor, Admin). |
| A-03 | Partidas presupuestales del ejercicio corriente pueden sembrarse (reales o sintéticas firmadas por PO). |
| A-04 | Object storage disponible en entorno de desarrollo/integración. |
| A-05 | Kafka (o bus equivalente acordado) disponible para eventos; outbox por servicio. |
| A-06 | PostgreSQL por servicio (DB-per-service) en el entorno de construcción. |
| A-07 | El equipo construye **API-first**; la UI Angular completa no es puerta de entrada del Sprint 1. |
| A-08 | `notification-service` puede quedar stub sin romper el happy path (aprobaciones visibles por bandeja WF). |
| A-09 | Normativa municipal específica se parametriza después; Sprint 1 usa reglas genéricas de fondos. |
| A-10 | Un solo proceso BPM productivo en Sprint 1: `PO_APPROVAL` (requisición puede reutilizar patrón submit→approve). |

---

## 1.8 Restricciones

| ID | Restricción |
|----|-------------|
| C-01 | Sin código de implementación en este paquete documental; la construcción inicia solo con DoR cumplido. |
| C-02 | Database per service; sin FK cross-service. |
| C-03 | Todo request autenticado valida `tenant_id`. |
| C-04 | Mutaciones de negocio relevantes → `AuditFact`. |
| C-05 | Compromiso presupuestal solo vía `budget-service`. |
| C-06 | Aprobaciones humanas solo vía `workflow-service`. |
| C-07 | Binarios solo en `document-service` + object storage. |
| C-08 | Stack alineado a ADRs existentes (Java 21 / Spring Boot 3+ / PostgreSQL / Kafka / Angular diferido UI). |
| C-09 | Commits y PRs siguen estándares del repo; sin ampliar alcance OUT-F1. |
| C-10 | Change Request: cualquier ítem de §1.4 que se quiera meter requiere PO + EA + CTO. |
| C-11 | Idioma de documentación de alcance: español; identificadores técnicos en inglés. |
| C-12 | Sprint 1 no incluye cutover productivo municipal; solo entorno(s) de construcción/integración. |

---

## 1.9 Criterio de salida del freeze

El Scope Freeze permanece vigente hasta:
1. Cierre formal del Sprint 1 (demo del happy path), **o**
2. Aprobación de Change Request que emita SF-002.

Firmas lógicas requeridas (registro en acta de kickoff):

| Rol | Firma |
|-----|-------|
| Product Owner | ________ |
| CTO | ________ |
| Enterprise Architect | ________ |
| Delivery Manager | ________ |

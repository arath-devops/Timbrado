# 2. Definition of Ready (DoR)
## DEL-S1-001 · DoR-001

| Campo | Valor |
|-------|--------|
| Documento | DoR-001 |
| Tipo | Definition of Ready oficial |
| Estado | **Vigente para Sprint 1** |
| Aplica a | Cada módulo/servicio del Scope Freeze SF-001 |
| Gate | Ningún ítem entra a desarrollo sin checklist DoR en **PASS** |

---

## 2.1 Qué significa “listo para desarrollo”

Un módulo está **Ready** cuando el equipo puede implementar sin descubrir reglas de negocio, contratos o ownership a mitad del sprint.

**Definición operativa (CTO + PO + EA + DM):**

> Un módulo está listo para desarrollo cuando tiene alcance congelado, casos de uso priorizados, requisitos funcionales y técnicos verificables, contrato API mínimo, eventos publicados/consumidos acordados, modelo de datos lógico mínimo, dependencias satifechas o mockeables, y criterios de aceptación escritos — sin necesidad de reinterpretar EA-DEC ni SA-MS en el día a día del coding.

**No es Ready** si solo existe ficha SA-MS narrativa, o si el contrato crítico con otro módulo está “TBD”.

---

## 2.2 Niveles de Ready

| Nivel | Significado | ¿Puede codear? |
|-------|------------|----------------|
| **DoR-0** | Idea / ficha SA-MS | No |
| **DoR-1 Scaffold** | Contratos + datos mínimos + casos de uso | Sí: skeleton, DB, endpoints stub |
| **DoR-2 Integrate** | Contratos firmados con vecinos + secuencias de uso | Sí: lógica de negocio e integración |
| **DoR-3 Demo** | Datos seed + criterios de aceptación de demo | Sí: cierre happy path |

Sprint 1 exige **DoR-1** para abrir desarrollo de un módulo y **DoR-2** antes de integrar con vecinos. El happy path demo exige **DoR-3** en los 7 módulos del freeze (o mocks explícitos aprobados por EA solo para notification).

---

## 2.3 Checklist universal (todo módulo)

Marcar PASS/FAIL. Un solo FAIL bloquea el gate.

### A. Alcance y producto
| # | Criterio | Evidencia |
|---|----------|-----------|
| A1 | Nombre canónico SA-MS-001 | Ficha en `docs/microservices/architecture/...` |
| A2 | Incluido en SF-001 §1.3 | Referencia explícita |
| A3 | Exclusiones del módulo listadas (qué NO hace en Sprint 1) | Sección en Baseline o ficha DoR del módulo |
| A4 | Owner de producto (PO) y owner técnico (tech lead) asignados | Registro sprint |
| A5 | Casos de uso Sprint 1 escritos (feliz + 1–2 alternos) | Ver §2.5 |

### B. Requisitos funcionales
| # | Criterio | Evidencia |
|---|----------|-----------|
| B1 | Lista RF numerada (RF-xxx) con actor y resultado | Baseline / anexo módulo |
| B2 | Cada RF mapea a endpoint o evento o job | Trazabilidad |
| B3 | Criterios de aceptación Given/When/Then por RF prioritario | Texto verificable |
| B4 | Reglas de negocio invariantes declaradas | Ej. fondos, tenant, append-only |

### C. Requisitos técnicos
| # | Criterio | Evidencia |
|---|----------|-----------|
| C1 | Stack alineado a ADR (servicio Spring Boot, DB Postgres, etc.) | ADR + nota módulo |
| C2 | Convención API `/api/v1`, health, errores `ApiError` | SA-MS-001 §1.4 |
| C3 | `tenant_id` en modelo y validación JWT | DoR técnico |
| C4 | Outbox/inbox o estrategia de publicación de eventos definida | Nota |
| C5 | Idempotencia definida donde hay side-effects críticos | Header/clave |
| C6 | Observabilidad mínima: correlationId, logs estructurados | Estándar |
| C7 | Migraciones versionadas (Flyway) como obligación | Estándar |

### D. Contratos API
| # | Criterio | Evidencia |
|---|----------|-----------|
| D1 | Lista de endpoints Sprint 1 (método, path, descripción) | SA-MS + Baseline |
| D2 | Request/response de operaciones críticas documentados (JSON) | Contrato transversal o anexo |
| D3 | Códigos de error de negocio estables (`INSUFFICIENT_FUNDS`, etc.) | Lista |
| D4 | Auth: roles/permisos mínimos por endpoint | Tabla corta |
| D5 | OpenAPI mínimo **redactado** (aunque sea YAML stub en repo) antes de DoR-2 | Artefacto |

### E. Eventos
| # | Criterio | Evidencia |
|---|----------|-----------|
| E1 | Eventos publicados Sprint 1 listados | Ficha |
| E2 | Eventos consumidos Sprint 1 listados | Ficha |
| E3 | Envelope estándar (eventId, type, version, tenantId, correlationId, payload) | SA-MS §1.5 |
| E4 | Topic naming `{layer}.{domain}.events` | Acuerdo |
| E5 | Payload mínimo de eventos críticos (campos) | Schema o tabla |

### F. Modelo de datos
| # | Criterio | Evidencia |
|---|----------|-----------|
| F1 | Agregados/entidades Sprint 1 nombrados | Lista |
| F2 | Modelo lógico mínimo (campos clave + tenant_id + auditoría + version) | Tabla/ERD lógico texto |
| F3 | Nombre de database (`*_db`) | SA-MS |
| F4 | Sin dependencia de tablas de otro servicio | Review EA |
| F5 | Estrategia de seed/datos de prueba definida | Nota PO/DM |

### G. Dependencias y readiness de vecinos
| # | Criterio | Evidencia |
|---|----------|-----------|
| G1 | Dependencias sync/async listadas | Matriz SF-001 |
| G2 | Vecinos críticos en DoR-1+ o mock contract-approved | Gate DM |
| G3 | Anti-corrupción / ownership claro | SA-MS límites |

### H. Calidad y entrega
| # | Criterio | Evidencia |
|---|----------|-----------|
| H1 | Definición de Done del módulo referenciada (mínimo: tests unitarios de invariantes + API smoke) | DoD sprint |
| H2 | Ambientes: dónde corre (local/compose/int) | DevOps note |
| H3 | Sin dependencia de ítems OUT (§1.4 SF) | Review PO |

**Gate DoR-1:** A–C PASS + D1 + E1/E2 + F1–F3.  
**Gate DoR-2:** DoR-1 + D2–D5 + E3–E5 + F4–F5 + G.  
**Gate DoR-3:** DoR-2 + seeds + CA de demo del happy path.

---

## 2.4 Requisitos transversales Sprint 1 (obligatorios)

### Funcionales transversales
| ID | Requisito |
|----|-----------|
| RF-X-01 | Todo usuario opera dentro de un `tenant_id` del piloto. |
| RF-X-02 | Roles mínimos reconocidos en JWT. |
| RF-X-03 | Toda aprobación humana pasa por `workflow-service`. |
| RF-X-04 | Toda afectación de compromiso pasa por `budget-service.commit/release`. |
| RF-X-05 | Toda mutación relevante genera `AuditFact`. |
| RF-X-06 | Documentos de la OC viven en case file de `document-service`. |

### Técnicos transversales
| ID | Requisito |
|----|-----------|
| RT-X-01 | DB-per-service PostgreSQL. |
| RT-X-02 | JWT Bearer en APIs de negocio. |
| RT-X-03 | `Idempotency-Key` en `commit` y `release`. |
| RT-X-04 | `X-Correlation-Id` propagado. |
| RT-X-05 | Core sin dependencia compile-time a ERP/GRP. |
| RT-X-06 | Tenant dedicado en runtime de datos del piloto. |

---

## 2.5 Casos de uso mínimos (plataforma — Sprint 1)

Estos casos de uso son **obligatorios** en el Baseline; cada módulo debe declarar su participación.

| ID | Caso de uso | Actores | Módulos |
|----|-------------|---------|---------|
| UC-01 | Autenticarse y obtener menú/roles | Usuario municipal | IAM |
| UC-02 | Administrar usuario y asignar rol | Admin | IAM |
| UC-03 | Consultar catálogo maestro | Capturista / sistema | Catalog |
| UC-04 | Sembrar/activar partida presupuestal | Admin presupuesto | Budget, Catalog |
| UC-05 | Consultar disponibilidad | Capturista / Jefe | Budget |
| UC-06 | Crear requisición/OC en borrador | Capturista | Procurement, Catalog |
| UC-07 | Adjuntar documento al expediente de compra | Capturista | Document, Procurement |
| UC-08 | Enviar OC a aprobación | Capturista | Procurement, Workflow |
| UC-09 | Comprometer presupuesto al aprobar | Sistema + Director | Budget, Procurement |
| UC-10 | Aprobar o rechazar tarea WF | Jefe / Director | Workflow, Procurement |
| UC-11 | Cancelar OC y liberar compromiso | Director / Admin compras | Procurement, Budget |
| UC-12 | Consultar trail de auditoría de una OC | Auditor | Audit |

Flujos alternos mínimos a documentar por módulo involucrado:
- Fondos insuficientes en commit (`INSUFFICIENT_FUNDS`)
- Rechazo de tarea WF
- Intento de acceso cross-tenant (debe fallar)

---

## 2.6 Contratos API — umbral Ready

Para declarar DoR-2 en un módulo, el contrato API debe incluir al menos:

1. Paths Sprint 1 (congelados; no “y los que falten”).  
2. Payload de comandos con side-effect.  
3. Respuestas 2xx y errores de negocio.  
4. Headers: `Authorization`, y si aplica `Idempotency-Key`, `X-Correlation-Id`.  
5. Referencia a claims JWT necesarios.

**Contrato crítico de plataforma (no negociable en Sprint 1):**

| Contrato | Productor | Consumidor | Ready si… |
|----------|-----------|------------|-----------|
| JWT/JWKS | iam | todos | claims mínimos publicados |
| CommitBudget | budget | procurement | request/response + errores + idempotencia |
| ReleaseCommitment | budget | procurement | idempotente |
| Availability | budget | procurement (UX) | read model documentado |
| StartProcess `PO_APPROVAL` | workflow | procurement | variables mínimas |
| ProcessCompleted/Rejected | workflow | procurement | payload + acción de dominio |
| CaseFile + Upload + Link | document | procurement | IDs y eventos |
| AuditFact | audit | todos | schema mínimo |

Detalle normativo: `docs/microservices/architecture/03-CONTRATOS-TRANSVERSALES.md`.

---

## 2.7 Eventos — umbral Ready

| Módulo | Publica (mínimo Sprint 1) | Consume (mínimo Sprint 1) |
|--------|---------------------------|---------------------------|
| iam | `UserRegistered`, `RoleAssigned`, `UserLocked` | — (o seed tenant) |
| catalog | `CatalogItemUpserted` (o equivalente) | — |
| audit | — (proyecciones internas) | hechos vía API/bridge |
| workflow | `ProcessCompleted`, `ProcessRejected`, `ProcessCancelled` | (opcional) document signed — **fuera** si no hay firma |
| document | `DocumentLinked` | — |
| budget | `BudgetCommitted`, `BudgetCommitFailed`, `BudgetCommitmentReleased` | outcomes WF de procesos budget si aplica (no obligatorio S1) |
| procurement | `PurchaseOrderSubmitted`, `PurchaseOrderApproved`, `PurchaseOrderRejected`, `PurchaseOrderCancelled` | WF outcomes + budget committed/failed/released |

Ready de eventos = nombres + campos mínimos + versión `eventVersion=1` + estrategia at-least-once + inbox idempotente.

---

## 2.8 Modelo de datos — umbral Ready

Cada módulo debe declarar entidades Sprint 1 y campos mínimos:

| Módulo | Entidades mínimas |
|--------|-------------------|
| iam | UserAccount, Role, UserRole, OrgScopeGrant, Session |
| catalog | CatalogType, CatalogItem |
| audit | AuditFact |
| workflow | ProcessDefinition, ProcessInstance, Task |
| document | CaseFile, DocumentItem, DocumentLink |
| budget | BudgetCycle, BudgetAllocation, BudgetMovement |
| procurement | PurchaseRequisition, PurchaseOrder (líneas mínimas), refs a allocation/caseFile |

Campos transversales obligatorios en tablas de negocio: `id`, `tenant_id`, `created_at`, `created_by`, `updated_at`, `updated_by`, `version` (optimistic lock donde haya concurrencia).

---

## 2.9 Definición por módulo: “Ready para desarrollo”

### iam-service — Ready cuando
- Roles municipales del Baseline listados y permisos mínimos por rol.  
- Endpoints token/JWKS/users/roles/me/menus especificados.  
- Modelo User/Role/OrgScope listo.  
- Excluido explícitamente: MFA/SSO/SoD avanzado.

### catalog-service — Ready cuando
- Catálogos del piloto (lista cerrada) definidos con códigos.  
- API de consulta/alta especificada.  
- Semántica activo/inactivo clara.

### audit-service — Ready cuando
- Schema `AuditFact` (actor, action, entity, before/after, correlationId).  
- API de ingesta + query.  
- Garantía append-only documentada.

### workflow-service — Ready cuando
- `PO_APPROVAL` descrito (start → task → complete/reject).  
- API start/complete task.  
- Eventos de outcome con `businessRef`.  
- Asignación por rol documentada.

### document-service — Ready cuando
- CaseFile + upload + link especificados.  
- Política de storage (bucket/prefix por tenant).  
- Evento `DocumentLinked`.  
- Excluido: OCR/QR/firma avanzada.

### budget-service — Ready cuando
- Invariante de fondos escrita.  
- API availability/commit/release con errores.  
- Modelo cycle/allocation/movement.  
- Eventos committed/failed/released.

### procurement-service — Ready cuando
- Estados OC Sprint 1 (DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED).  
- Integración WF + CommitBudget + Document + Audit descrita en casos de uso.  
- API requisition/PO submit/cancel.  
- Excluido: GR/factura/match.

---

## 2.10 Roles en el gate DoR

| Rol | Responsabilidad en el gate |
|-----|----------------------------|
| Product Owner | Valida RF, UC, inclusiones/exclusiones |
| Enterprise Architect | Valida límites, contratos, datos, anti-deps |
| CTO | Valida riesgo técnico y umbral DoR-1/2/3 |
| Delivery Manager | Facilita checklist, bloquea coding sin PASS, registra excepciones |

**Excepción:** solo el CTO puede autorizar mock temporal de un vecino; debe tener fecha de caducidad ≤ fin de Sprint 1 y contrato mock igual al real.

---

## 2.11 Definition of Done (referencia cruzada mínima)

DoR no sustituye DoD. Para Sprint 1, DoD mínimo de un incremento:
1. Cumple RF aceptados del Baseline.  
2. Contratos implementados no rompen el freeze.  
3. Happy path demostrable en integración.  
4. AuditFact visible para mutaciones demo.  
5. Sin escritura cross-DB.  
6. Documentación de endpoints efectivamente expuestos actualizada.

El DoD detallado puede vivir en el plan de sprint; el **gate de entrada** es este DoR.

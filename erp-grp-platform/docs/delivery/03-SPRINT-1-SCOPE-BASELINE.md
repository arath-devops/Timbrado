# 3. Sprint 1 Scope Baseline
## DEL-S1-001 · BL-S1-001

| Campo | Valor |
|-------|--------|
| Documento | BL-S1-001 |
| Tipo | Sprint Scope Baseline |
| Estado | **Baseline congelado** |
| Sprint | Sprint 1 — Construcción inicial (MVP spine) |
| Objetivo del sprint | Demostrar el happy path municipal: identidad → catálogo → compra con expediente → aprobación WF → compromiso presupuestal → auditoría |
| Relacionados | SF-001, DoR-001, EA-DEC-001, SA-MS-001 |

---

## 3.1 Meta de Sprint 1 (una frase)

> Un usuario municipal autenticado crea una orden de compra ligada a una partida, adjunta un documento, la envía a aprobación, el sistema compromete presupuesto de forma idempotente y deja rastro auditable; sin compromiso no hay aprobación.

---

## 3.2 Capacidad entregable (Commitment)

| Capacidad | ¿Comprometida? |
|-----------|----------------|
| APIs de los 7 módulos del freeze para el happy path | Sí |
| Integración sync CommitBudget | Sí |
| Proceso `PO_APPROVAL` | Sí |
| Seed tenant + roles + catálogos + partidas demo | Sí |
| UI Angular completa | **No** (opcional smoke; no es commitment) |
| notification-service productivo | **No** (stub permitido) |
| Recepción/factura/devengado | **No** |

---

## 3.3 Roles municipales del piloto (congelados)

| Rol | Código sugerido | Puede |
|-----|-----------------|-------|
| Administrador | `ADMIN` | Usuarios, catálogos, ciclos/partidas seed |
| Capturista de compras | `PUR_CLERK` | Crear REQ/OC, adjuntar docs, submit |
| Jefe de área | `PUR_MANAGER` | Aprobar tareas WF de su OrgScope |
| Director | `PUR_DIRECTOR` | Aprobar OC / cancelar |
| Auditor | `AUDITOR` | Solo lectura + consulta audit trail |
| Operador presupuesto | `BUDGET_OPS` | Ciclo/allocations/availability |

OrgScope Sprint 1: al menos un `OU_SUBTREE` por usuario operativo de compras.

---

## 3.4 Catálogos maestros incluidos (lista cerrada)

| Código catálogo | Uso |
|-----------------|-----|
| `ORG_UNIT` | Unidades administrativas municipales |
| `BUDGET_CATEGORY` / rubro | Clasificación de partida (mínimo) |
| `SUPPLIER_BASIC` | Proveedor básico para OC |
| `CURRENCY` | MXN (fijo) |
| `DOC_TYPE` | Tipos documentales mínimos (OFICIO, COTIZACION, OTRO) |

Cualquier otro catálogo → Change Request.

---

## 3.5 Requisitos funcionales por módulo

### IAM — `iam-service`
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-IAM-01 | Autenticar usuario del tenant y emitir access token JWT | Must |
| RF-IAM-02 | Exponer JWKS para validación | Must |
| RF-IAM-03 | CRUD básico de usuarios (alta, consulta, lock) | Must |
| RF-IAM-04 | Asignar/revocar roles del set congelado | Must |
| RF-IAM-05 | Registrar OrgScopeGrant básico | Must |
| RF-IAM-06 | `GET /me` con roles, scopes, modules | Must |
| RF-IAM-07 | `GET /me/menus` árbol mínimo de módulos MVP | Must |
| RF-IAM-08 | MFA / SSO federado | Out |

### Catalog — `catalog-service`
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-CAT-01 | Crear/actualizar ítems de catálogos de la lista cerrada | Must |
| RF-CAT-02 | Consultar por tipo y código | Must |
| RF-CAT-03 | Desactivar ítem (no borrar físico) | Must |
| RF-CAT-04 | Multidioma completo | Out |

### Audit — `audit-service`
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-AUD-01 | Ingestar AuditFact con actor, acción, entidad, before/after, correlationId | Must |
| RF-AUD-02 | Consultar trail por entidad | Must |
| RF-AUD-03 | Rechazar update/delete de facts (append-only) | Must |
| RF-AUD-04 | UI de investigación avanzada / ES full | Out (ES opcional post) |

### Workflow — `workflow-service`
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-WF-01 | Desplegar definición `PO_APPROVAL` | Must |
| RF-WF-02 | Start process con businessRef y variables (amount, currency, orgUnitId, caseFileId) | Must |
| RF-WF-03 | Listar/reclamar/completar tareas (approve/reject) | Must |
| RF-WF-04 | Publicar ProcessCompleted / ProcessRejected | Must |
| RF-WF-05 | SLA/escalamiento automático | Out |
| RF-WF-06 | Diseñador visual BPMN | Out |

### Document — `document-service`
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-DOC-01 | Crear case file | Must |
| RF-DOC-02 | Upload documento a storage y metadatos | Must |
| RF-DOC-03 | Vincular documento a aggregate (OC) | Must |
| RF-DOC-04 | Descargar documento autorizado | Must |
| RF-DOC-05 | Emitir DocumentLinked | Must |
| RF-DOC-06 | OCR / QR / firma avanzada / retención legal | Out |

### Budget — `budget-service`
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-BUD-01 | Crear/activar ciclo presupuestal del ejercicio piloto | Must |
| RF-BUD-02 | Crear allocation con authorizedAmount | Must |
| RF-BUD-03 | Consultar availability | Must |
| RF-BUD-04 | Commit sync idempotente | Must |
| RF-BUD-05 | Release sync idempotente | Must |
| RF-BUD-06 | Emitir BudgetCommitted / Failed / Released | Must |
| RF-BUD-07 | Enforce authorized ≥ committed | Must |
| RF-BUD-08 | Accrue / pay / modify / freeze avanzado | Out |

### Procurement — `procurement-service`
| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-PRO-01 | Crear requisición (opcional si se usa OC directo; al menos uno de REQ u OC draft) | Must |
| RF-PRO-02 | Crear OC en DRAFT con allocationId, supplier, monto, caseFileId | Must |
| RF-PRO-03 | Submit OC → start WF | Must |
| RF-PRO-04 | Antes de APPROVED efectivo: CommitBudget; si falla → no aprobar | Must |
| RF-PRO-05 | Consumir ProcessCompleted/Rejected y reflejar estado | Must |
| RF-PRO-06 | Cancel → release compromiso | Must |
| RF-PRO-07 | Goods receipt / invoice match | Out |

---

## 3.6 Casos de uso detallados (Baseline)

### UC-01 Autenticación
- **Actor:** Usuario municipal  
- **Precondición:** Usuario activo en tenant piloto  
- **Flujo:** login → token → /me  
- **Postcondición:** Cliente posee JWT válido con tenant_id y roles  
- **Aceptación:** token inválido o tenant incorrecto es rechazado por RS

### UC-06/08 Crear y enviar OC
- **Actor:** Capturista  
- **Precondición:** Catálogos y partida con disponibilidad; case file creado  
- **Flujo:** DRAFT OC → link docs → submit → ProcessInstance activa  
- **Postcondición:** OC en SUBMITTED; tarea WF visible a rol aprobador  
- **Aceptación:** sin allocationId o sin token → error; submit sin fondos se valida en commit al aprobar

### UC-09/10 Compromiso y aprobación
- **Actor:** Sistema + Director/Jefe  
- **Precondición:** Tarea WF abierta; OC SUBMITTED  
- **Flujo:** approve task → procurement solicita commit (Idempotency-Key) →  
  - si COMMITTED → OC APPROVED + AuditFact  
  - si INSUFFICIENT_FUNDS → OC no queda APPROVED; se registra fallo  
- **Aceptación:** doble approve con misma key no duplica compromiso; authorized nunca baja de committed por bug de race (lock/optimistic)

### UC-11 Cancelación
- **Actor:** Director  
- **Precondición:** OC APPROVED con compromiso  
- **Flujo:** cancel → release → estado CANCELLED + evento  
- **Aceptación:** availability recupera el monto liberado

### UC-12 Auditoría
- **Actor:** Auditor  
- **Flujo:** consulta facts de PurchaseOrder id  
- **Aceptación:** aparecen SUBMITTED/APPROVED/CANCELLED (o acciones equivalentes) con actor y correlationId

---

## 3.7 Contratos API — baseline Sprint 1 (lista cerrada)

> Detalle de payloads críticos en SA-MS-001 `03-CONTRATOS-TRANSVERSALES.md`. Aquí se congela el **set**.

### iam-service
`POST /oauth2/token` · `GET /oauth2/jwks` · `GET|POST /api/v1/users` · `POST /api/v1/users/{id}/roles` · `POST /api/v1/users/{id}/lock` · `GET|POST /api/v1/roles` · `POST /api/v1/scopes` · `GET /api/v1/me` · `GET /api/v1/me/menus`

### catalog-service
`GET|POST /api/v1/catalogs/{type}/items` · `GET /api/v1/catalogs/{type}/items/{code}` · `POST /api/v1/catalogs/{type}/items/{code}/deactivate`

### audit-service
`POST /api/v1/facts` · `GET /api/v1/facts?entityType&entityId`

### workflow-service
`POST /api/v1/processes/{processKey}/start` · `GET /api/v1/tasks` · `POST /api/v1/tasks/{id}/complete`

### document-service
`POST /api/v1/case-files` · `POST /api/v1/case-files/{id}/documents` · `POST /api/v1/documents/{id}/links` · `GET /api/v1/documents/{id}`

### budget-service
`POST /api/v1/cycles` · `POST /api/v1/allocations` · `GET /api/v1/availability` · `POST /api/v1/movements/commit` · `POST /api/v1/movements/release`

### procurement-service
`POST|GET /api/v1/requisitions` · `POST /api/v1/requisitions/{id}/submit` · `POST|GET /api/v1/purchase-orders` · `POST /api/v1/purchase-orders/{id}/submit` · `POST /api/v1/purchase-orders/{id}/cancel`

Cualquier path adicional en Sprint 1 requiere nota en CR (salvo health/actuator/OpenAPI docs).

---

## 3.8 Eventos — baseline Sprint 1 (lista cerrada)

| Servicio | Publica |
|----------|---------|
| iam | UserRegistered, RoleAssigned, UserLocked |
| catalog | CatalogItemUpserted |
| workflow | ProcessCompleted, ProcessRejected, ProcessCancelled |
| document | DocumentLinked |
| budget | BudgetCommitted, BudgetCommitFailed, BudgetCommitmentReleased |
| procurement | PurchaseOrderSubmitted, PurchaseOrderApproved, PurchaseOrderRejected, PurchaseOrderCancelled |

Consumos obligatorios:
- procurement ← ProcessCompleted/Rejected, BudgetCommitted/Failed/Released  
- audit ← facts desde productores (API/bridge)

---

## 3.9 Modelo de datos — baseline Sprint 1

| DB | Entidades |
|----|-----------|
| `iam_db` | user_account, role, user_role, org_scope_grant, session |
| `catalog_db` | catalog_type, catalog_item |
| `audit_db` | audit_fact |
| `workflow_db` | process_definition, process_instance, task |
| `document_db` | case_file, document_item, document_link |
| `budget_db` | budget_cycle, budget_allocation, budget_movement |
| `procurement_db` | purchase_requisition, purchase_order, purchase_order_line |

Estados OC congelados: `DRAFT | SUBMITTED | APPROVED | REJECTED | CANCELLED`.  
Tipos movimiento budget Sprint 1: `COMMIT | RELEASE` (accrue/pay fuera).

---

## 3.10 Requisitos técnicos del sprint

| ID | Requisito |
|----|-----------|
| RT-S1-01 | Un repositorio/servicio deployable por módulo (o monorepo modular equivalente ya definido en arquetipo) |
| RT-S1-02 | Flyway por servicio |
| RT-S1-03 | Validación JWT en resource servers |
| RT-S1-04 | Outbox para eventos de dominio publicados |
| RT-S1-05 | Idempotency store para commit/release |
| RT-S1-06 | Seed script: tenant, users/roles, catálogos, ciclo, 2–3 partidas, 1 proveedor |
| RT-S1-07 | CorrelationId en logs |
| RT-S1-08 | Health liveness/readiness |
| RT-S1-09 | OpenAPI stub publicado por servicio al alcanzar DoR-2 |
| RT-S1-10 | Entorno de integración donde corra el happy path end-to-end |

---

## 3.11 Orden de construcción recomendado (Delivery)

| Oleada | Módulos | Resultado |
|--------|---------|-----------|
| S1-A | iam, audit, catalog | Identidad + maestros + trail |
| S1-B | workflow, document | Aprobación + expediente |
| S1-C | budget | Fondos + commit/release |
| S1-D | procurement | Orquestación happy path |
| S1-E | Integración E2E + demo | UC-01…12 demostrables |

Paralelismo permitido solo dentro de la misma oleada y con contratos DoR-2 de vecinos.

---

## 3.12 Criterios de aceptación del Sprint 1 (Demo Gate)

1. Login con usuario Capturista y Director en tenant dedicado.  
2. Existen catálogos y al menos una partida con disponibilidad conocida.  
3. Se crea OC con documento adjunto en case file.  
4. Submit genera tarea `PO_APPROVAL`.  
5. Al aprobar: CommitBudget OK → OC APPROVED; audit trail consultable.  
6. Escenario fondos insuficientes: no queda APPROVED; se observa BudgetCommitFailed o error de negocio.  
7. Cancel de OC aprobada libera compromiso y actualiza availability.  
8. Intento con JWT de otro tenant_id falla.  
9. Ningún servicio escribió en DB ajena.  
10. Lista de exclusiones SF-001 §1.4 no implementada “de contrabando”.

---

## 3.13 Fuera de baseline (recordatorio corto)

Nómina, ciudadanía, recaudación, programas sociales, BI, IA, MFA/SSO completo, OCR/firma avanzada, recepción/factura, accrue/pay, contabilidad/tesorería, UI completa, notification productivo, multi-tenant compartido en data plane del piloto, licitaciones públicas.

---

## 3.14 Change Control

| Tipo de cambio | Aprueba |
|----------------|---------|
| Ajuste menor de campo en payload sin romper consumidores | EA + Tech Lead |
| Nuevo endpoint dentro del mismo UC | PO + EA |
| Nuevo UC o módulo | PO + CTO + EA + DM (nueva baseline) |
| Meter ítem de exclusiones | CR formal (SF-002) |

---

## 3.15 Checklist pre-coding (kickoff Sprint 1)

- [ ] SF-001 leído y firmado lógicamente  
- [ ] DoR-001 gates entendidos por el equipo  
- [ ] BL-S1-001 aceptado como commitment  
- [ ] Owners PO/técnicos por módulo asignados  
- [ ] DoR-1 PASS en oleada S1-A antes de primer commit de negocio  
- [ ] Contrato CommitBudget reconfirmado (SA-MS-001)  
- [ ] Seed municipal (real o sintético) aprobado por PO  

**Al completar este checklist, el Sprint 1 está autorizado a construir.**

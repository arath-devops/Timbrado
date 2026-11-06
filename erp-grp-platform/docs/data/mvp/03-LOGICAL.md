# 3. Modelo lógico MVP
## DA-MVP-001

Entidades, atributos clave, cardinalidades. Tipos lógicos (no aún PG).

### Notación
- `1` / `N` · UK = unique · SoftRef = UUID sin FK cross-DB

---

## 3.1 iam_db

| Entidad | Atributos lógicos | Relaciones |
|---------|-------------------|------------|
| **UserAccount** | id, tenantId, username UK, email, displayName, status, audit+, version | 1—N UserRole; 1—N OrgScopeGrant; 1—N Session |
| **Role** | id, tenantId, code UK, name, description, permissions[], audit+, version | N—N User via UserRole |
| **UserRole** | userId, roleId, assignedAt, assignedBy | N:1 User, N:1 Role |
| **OrgScopeGrant** | id, tenantId, userId, type (OU_SUBTREE\|OU_EXACT), orgUnitId SoftRef, audit+ | N:1 User |
| **Session** | id, tenantId, userId, revoked, expiresAt, createdAt | N:1 User |
| **Outbox / Inbox / IdempotencyRecord** | infra de integración | — |

## 3.2 catalog_db

| Entidad | Atributos | Relaciones |
|---------|-----------|------------|
| **CatalogType** | id, tenantId, code UK, name, active | 1—N CatalogItem |
| **CatalogItem** | id, tenantId, typeId, code UK(type), name, description, status, attributes{}, audit+, version | N:1 CatalogType |

> Justificación CatalogType como tabla: permite metadatos/validación por tipo sin hardcode exclusivo en código; seed inserta los 5 tipos del baseline.

## 3.3 audit_db

| Entidad | Atributos | Relaciones |
|---------|-----------|------------|
| **AuditFact** | id, tenantId, entityType, entityId, action, actor, actorType, before{}, after{}, correlationId, causationId, requestId, traceId, sourceService, occurredAt, recordedAt, contentHash | Ninguna FK de negocio (append-only) |
| **IdempotencyRecord** | key, requestHash, response, createdAt | — |

## 3.4 workflow_db

| Entidad | Atributos | Relaciones |
|---------|-----------|------------|
| **ProcessDefinition** | id, tenantId?, processKey UK, version, definitionJson, active, audit+ | 1—N ProcessInstance |
| **ProcessInstance** | id, tenantId, definitionId, processKey, status, businessRef{bc,type,id}, variables{}, correlationId, audit+, version | 1—N Task |
| **Task** | id, tenantId, processInstanceId, name, status, outcome, candidateRoles[], assigneeId SoftRef, comment, audit+ | N:1 ProcessInstance |

## 3.5 document_db

| Entidad | Atributos | Relaciones |
|---------|-----------|------------|
| **CaseFile** | id, tenantId, title, status, owningBC, aggregateType, aggregateId SoftRef, orgUnitId SoftRef, audit+, version | 1—N DocumentItem |
| **DocumentItem** | id, tenantId, caseFileId, docType, title, status, contentType, sizeBytes, storageKey, checksumSha256, audit+, version | N:1 CaseFile; 1—N DocumentLink |
| **DocumentLink** | id, tenantId, documentId, boundedContext, aggregateType, aggregateId, relation, linkedAt, linkedBy | N:1 DocumentItem |

## 3.6 procurement_db

| Entidad | Atributos | Relaciones |
|---------|-----------|------------|
| **PurchaseRequisition** | id, tenantId, status, orgUnitId SoftRef, allocationId SoftRef, caseFileId SoftRef, currency, totalAmount, justification, processInstanceId SoftRef, audit+, version | 1—N lines; 0—1 PO |
| **PurchaseRequisitionLine** | id, requisitionId, description, qty, unitPrice, unitCode, lineTotal | N:1 REQ |
| **PurchaseOrder** | id, tenantId, status, requisitionId?, orgUnitId, allocationId, supplierCode SoftRef(catalog), caseFileId, currency, totalAmount, processInstanceId, budgetMovementId SoftRef, notes, audit+, version | 1—N lines |
| **PurchaseOrderLine** | id, purchaseOrderId, description, qty, unitPrice, unitCode, lineTotal | N:1 PO |

## 3.7 budget_db

| Entidad | Atributos | Relaciones |
|---------|-----------|------------|
| **BudgetCycle** | id, tenantId, code UK, fiscalYear UK, name, status, audit+, version | 1—N Allocation |
| **BudgetAllocation** | id, tenantId, cycleId, code UK(cycle), name, categoryCode SoftRef, orgUnitId SoftRef, status, authorized, committed, accrued, paid, currency, audit+, version | N:1 Cycle; 1—N Movement |
| **BudgetMovement** | id, tenantId, allocationId, movementType (COMMIT\|RELEASE), amount, currency, referenceType, referenceId, idempotencyKey, createdAt, createdBy | N:1 Allocation (append-only) |

**Invariante lógica:** `authorized ≥ committed ≥ accrued ≥ paid` en Allocation.

# 1. PurchaseApprovalSaga — Diseño completo
## SAGA-MVP-001

## 1.1 Propósito de negocio

Garantizar que una **solicitud de compra municipal** solo quede **aprobada** si:

1. Existe evidencia documental mínima vinculada.  
2. Un aprobador humano completó el workflow `PO_APPROVAL`.  
3. El presupuesto fue **comprometido** de forma idempotente.  
4. Quedó **rastro auditable** de cada paso relevante.

## 1.2 Agregado raíz y saga state

| Concepto | Dueño | Persistencia |
|----------|-------|--------------|
| `PurchaseRequest` / `PurchaseOrder` | procurement-service | `procurement_db` |
| **Saga state** `PurchaseApprovalSaga` | procurement-service | Tabla lógica `purchase_approval_saga` (o campos en PO + outbox) |
| Fondos | budget-service | `budget_db` |
| Proceso humano | workflow-service | `workflow_db` |
| Expediente | document-service | `document_db` |
| Trail | audit-service | `audit_db` |

> En Sprint 1 la saga puede materializarse como **máquina de estados del PO/REQ + outbox/inbox**, sin microservicio “saga” separado.

## 1.3 Pipeline lógico (pedido del MVP)

```text
Solicitud Compra
      ↓
Aprobación (Workflow)
      ↓
Commit Budget
      ↓
Documento (cierre/vínculo confirmatorio)
      ↓
Auditoría (proyección / facts finales)
```

### Ajuste arquitectónico (obligatorio)

El **documento de soporte** se captura **antes o durante** la solicitud (guard de submit).  
La etapa “Documento” del pipeline post-commit es el **cierre/confirmación de vínculo** (`DocumentLinked` / checklist), no el primer upload.

```text
[Pre] Create REQ/OC + Upload/Link docs (guard)
[1]  Submit → Start Workflow (Aprobación)
[2]  Human APPROVE → CommitBudget sync
[3]  Mark APPROVED + emit domain events
[4]  Confirm DocumentLinked / case file
[5]  AuditRecordCreated (cada mutación + cierre)
```

## 1.4 Participantes

| Participante | Rol en la saga |
|--------------|----------------|
| Capturista | Inicia solicitud, adjunta docs |
| procurement-service | **Orquestador** |
| workflow-service | Aprobación humana |
| budget-service | Commit / Release fondos |
| document-service | Case file / upload / link |
| audit-service | Ingesta append-only |
| Kafka | Transporte de eventos espejo / proyección |

## 1.5 Identificadores de correlación

| ID | Uso |
|----|-----|
| `sagaId` | UUID de instancia de saga (= `purchaseOrderId` o dedicado) |
| `correlationId` | E2E (HTTP + eventos) |
| `idempotencyKey` | Por comando crítico (commit, start WF, submit) |
| `tenantId` | Aislamiento |

## 1.6 Resultado de negocio exitoso

Estado final agregado: **APPROVED**  
Fondos: **COMMITTED**  
WF: **COMPLETED / APPROVED**  
Docs: al menos un `DocumentLinked`  
Audit: facts de SUBMITTED, WF, COMMIT, APPROVED visibles

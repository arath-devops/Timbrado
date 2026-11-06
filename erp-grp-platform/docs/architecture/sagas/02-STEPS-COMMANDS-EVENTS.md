# 2. Pasos, comandos, eventos y compensaciones
## SAGA-MVP-001

## 2.1 Pasos de la saga

| Step | Nombre | Actor técnico | Tipo | Timeout sugerido |
|------|--------|---------------|------|------------------|
| S0 | `CreatePurchaseRequest` | procurement | Local command | — |
| S1 | `AttachSupportingDocuments` | document (+ procurement) | Sync API | 30s upload ack |
| S2 | `SubmitForApproval` | procurement | Local + start WF | 5s |
| S3 | `AwaitHumanApproval` | workflow | Wait state | SLA negocio (ej. 72h) |
| S4 | `CommitBudget` | budget via procurement | **Sync command** | 300ms p99 |
| S5 | `MarkApproved` | procurement | Local | — |
| S6 | `ConfirmDocumentLinkage` | document | Sync/event | 5s |
| S7 | `EmitAuditTrail` | audit | Async (API/outbox) | 5s / retry |
| S8 | `SagaCompleted` | procurement | Local | — |

Compensación / abort paths: `C4 ReleaseBudget`, `C3 CancelWorkflow`, `C2 RevertSubmit`, `C1 QuarantineOrKeepDocs`, `A* AuditCompensationFact`.

---

## 2.2 Comandos (intentos)

| Comando | Emisor → Receptor | API / mecanismo | Idempotencia |
|---------|-------------------|-----------------|--------------|
| `CreatePurchaseRequest` | UI → procurement | `POST /purchase-orders` o `/requisitions` | `Idempotency-Key` opcional |
| `UploadDocument` | UI → document | `POST /case-files/{id}/documents` | key opcional + checksum |
| `LinkDocument` | procurement/UI → document | `POST /documents/{id}/links` | key opcional |
| `SubmitPurchaseRequest` | UI → procurement | `POST .../submit` | **Idempotency-Key** Must |
| `StartProcess(PO_APPROVAL)` | procurement → workflow | `POST /processes/PO_APPROVAL/start` | **Idempotency-Key** Must |
| `CompleteTask(APPROVE\|REJECT)` | aprobador → workflow | `POST /tasks/{id}/complete` | **Idempotency-Key** Must |
| `CommitBudget` | procurement → budget | `POST /movements/commit` | **Idempotency-Key** Must |
| `ReleaseBudget` | procurement → budget | `POST /movements/release` | **Idempotency-Key** Must |
| `CancelProcess` | procurement → workflow | `POST /processes/{id}/cancel` (si expuesto) / política interna | Idempotent |
| `IngestAuditFact` | any → audit | `POST /facts` | **Idempotency-Key** Must |
| `MarkPurchaseApproved` | saga → procurement local | dominio interno | Por `sagaId` + versión |
| `MarkPurchaseRejected` | saga → procurement local | dominio interno | Idempotent |

---

## 2.3 Eventos (hechos)

| Evento | Cuándo | Consumidores saga-relevantes |
|--------|--------|------------------------------|
| `PurchaseRequestCreated` | S0 | audit |
| `DocumentUploaded` | S1 | audit |
| `DocumentLinked` | S1/S6 | procurement, audit |
| `PurchaseOrderSubmitted` / señal submit | S2 | audit |
| `WorkflowStarted` | S2 | procurement (confirm), audit |
| `WorkflowApproved` | S3 | **procurement orquesta S4** |
| `WorkflowRejected` | S3 | procurement → reject path |
| `BudgetCommitted` | S4 espejo | procurement (confirm), audit |
| `BudgetCommitFailed` | S4 fallo | procurement → compensación |
| `BudgetReleased` | compensación | procurement, audit |
| `PurchaseRequestApproved` | S5 | audit, budget (señal) |
| `AuditRecordCreated` | S7 | proyecciones |

---

## 2.4 Compensaciones por paso

| Step logrado | Compensación | Comando/Evento | ¿Reversible? |
|--------------|--------------|----------------|--------------|
| S0 Created | Mantener DRAFT o soft-cancel | `MarkCancelled` / leave DRAFT | Sí (estado) |
| S1 Docs | **No borrar** binario; unlink o quarantine | `UnlinkDocument` / status QUARANTINED | Parcial |
| S2 WF started | Cancelar proceso | `CancelProcess` → `ProcessCancelled` | Sí |
| S3 Approved (task) | No “des-aprobar” tarea; cancel proceso si aún no S5 | política WF | Limitado |
| S4 Budget committed | **Release** | `ReleaseBudget` → `BudgetReleased` | Sí (fondos) |
| S5 Mark approved | Revertir a REJECTED/CANCELLED + release si hace falta | local + `ReleaseBudget` | Sí con cuidado |
| S6 Doc confirm | Unlink confirmatorio | unlink | Parcial |
| S7 Audit | **Nunca borrar**; emitir `AuditRecordCreated` de compensación | nuevo fact `SAGA_COMPENSATED` | No destructivo |

---

## 2.5 Matriz comando ↔ evento ↔ compensación

| Paso feliz | Comando | Evento éxito | Compensación |
|------------|---------|--------------|--------------|
| Solicitud | CreatePurchaseRequest | PurchaseRequestCreated | Cancel/DRAFT |
| Documento (pre) | Upload/Link | DocumentUploaded/Linked | Unlink/quarantine |
| Aprobación start | StartProcess | WorkflowStarted | CancelProcess |
| Aprobación ok | CompleteTask(APPROVE) | WorkflowApproved | (continúa o abort antes de commit) |
| Aprobación no | CompleteTask(REJECT) | WorkflowRejected | Revert SUBMITTED→REJECTED |
| Commit | CommitBudget | BudgetCommitted | ReleaseBudget |
| Commit fail | CommitBudget | BudgetCommitFailed | MarkRejected + optional CancelWF done |
| Cierre | MarkApproved | PurchaseRequestApproved | Cancel+Release |
| Audit | IngestAuditFact | AuditRecordCreated | Fact compensatorio |

---

## 2.6 Pseudocódigo del orquestador (referencia)

```text
on Submit(poId, idemKey):
  assert docsLinked
  startProcess PO_APPROVAL (idemKey)
  state = AWAITING_APPROVAL
  audit SUBMITTED

on WorkflowApproved(poId):
  state = COMMITTING_BUDGET
  resp = CommitBudget(idemKey=sagaId+"-commit")
  if resp.COMMITTED:
       MarkApproved; state = CONFIRMING_DOCS; confirmLinks; state = COMPLETED
       audit APPROVED
  if resp.INSUFFICIENT_FUNDS:
       MarkRejected; CancelProcess if needed; state = COMPENSATED_BUDGET_REJECTED
       audit COMMIT_FAILED

on WorkflowRejected:
  MarkRejected; state = REJECTED; audit REJECTED

on Timeout(AWAITING_APPROVAL):
  escalate or auto-reject per policy; compensate WF; state = TIMED_OUT

on technical failure:
  retry with backoff; if exhausted → state = NEEDS_RECOVERY (+ alert)
```

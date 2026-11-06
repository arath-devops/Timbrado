# 3. Casos de falla y rollback
## SAGA-MVP-001

## 3.1 Budget aprobado (COMMITTED) — camino feliz post-WF

| Aspecto | Comportamiento |
|---------|----------------|
| Trigger | `WorkflowApproved` + `CommitBudget` → 200 COMMITTED |
| Efectos | PO/REQ → APPROVED; `BudgetCommitted`; `PurchaseRequestApproved`; audit facts |
| Rollback | No aplica |
| Idempotencia | Re-entrega `WorkflowApproved` no re-commitea (misma Idempotency-Key) |

## 3.2 Budget rechazado (INSUFFICIENT_FUNDS / COMMIT failed)

| Aspecto | Comportamiento |
|---------|----------------|
| Trigger | `CommitBudget` → 422 `INSUFFICIENT_FUNDS` (+ evento `BudgetCommitFailed`) |
| Efectos | **No** APPROVED; estado `REJECTED` o `SUBMITTED`→`REJECTED`; audit `COMMIT_FAILED` |
| Compensación | WF ya aprobado: cancelar/cerrar proceso como rechazado de negocio; **no** Release (no hubo commit) |
| UX | Capturista ve fondos insuficientes; puede editar/cancelar |

```text
Rollback parcial:
  APPROVAL_DONE → BUDGET_FAILED → MarkRejected → Audit → Saga=COMPENSATED_BUDGET_REJECTED
```

## 3.3 Timeout

### 3.3.1 Timeout de aprobación humana (S3)

| Política MVP | Detalle |
|--------------|---------|
| Default | Alerta SLA + escalamiento manual (BPM-001); auto-reject **opcional** por tenant |
| Si auto-reject | `MarkRejected` + `CancelProcess` + audit `TIMEOUT_REJECTED` |
| Compensación fondos | N/A (aún no commit) |

### 3.3.2 Timeout técnico CommitBudget (S4)

| Paso | Acción |
|------|--------|
| 1 | Retry sync con misma `Idempotency-Key` (backoff 50–200ms, max 3) |
| 2 | Si timeout indefinido (sí/no commit desconocido) → estado `NEEDS_RECOVERY` |
| 3 | Recovery job consulta budget por `referenceId` o reintenta commit idempotente |
| 4 | **No** MarkApproved hasta confirmación COMMITTED |

## 3.4 Falla Kafka

| Escenario | Impacto | Recuperación |
|-----------|---------|--------------|
| Outbox no publicado | Agregado OK, proyección/consumidores atrasados | Publisher reintenta outbox; saga **no** bloquea APPROVED si sync commit ya OK |
| Consumer lag / down | Eventos se acumulan | Reanudar consumer; inbox dedup por `eventId` |
| Mensaje poison | DLQ `{topic}.dlq` | Replay manual tras fix |
| Pérdida de broker (int) | Eventos pendientes en outbox | Outbox es fuente; Kafka no es SoT del commit |

> **Regla:** la decisión de fondos **no** depende de Kafka; depende del comando sync. Kafka falla ≠ rollback de budget automáticamente.

## 3.5 Falla Workflow

| Escenario | Acción |
|-----------|--------|
| `StartProcess` 5xx / timeout | Retry idempotente; si agota → saga `FAILED_START_WF`; PO sigue DRAFT/SUBMITTED según política (preferir no SUBMITTED sin processInstanceId) |
| Proceso huérfano | Job reconciliación por `businessRef` |
| `CompleteTask` falla tras APPROVE visual | UI reintenta misma key; servidor idempotente |
| WF caído durante wait | Estado permanece `AWAITING_APPROVAL`; al volver, tareas siguen |
| WF rejected path falla al notificar | Procurement consume `WorkflowRejected` con retry inbox |

**Rollback:** si WF no arrancó, no hay budget que liberar. Si WF cancelado post-commit (raro) → `ReleaseBudget` + MarkCancelled.

## 3.6 Falla Document Service

| Momento | Escenario | Acción |
|---------|-----------|--------|
| Pre-submit (S1) | Upload 5xx / storage down | Bloquear submit (guard docs); saga no inicia |
| Pre-submit | Link falla | Bloquear submit |
| Post-commit (S6) | Confirm link falla | **No** revertir APPROVED/COMMIT por doc opcional de cierre; reintentar S6; estado `COMPLETED_WITH_DOC_PENDING` |
| Corrupt/quarantine | Virus scan futuro | Quarantine doc; si era guard obligatorio pre-submit, no debió llegar |

**Principio:** documento post-commit es **best-effort** con retry; no dispara ReleaseBudget. Documento pre-submit es **hard dependency**.

## 3.7 Matriz resumen rollback

| Caso | ¿ReleaseBudget? | ¿Cancel WF? | Estado final saga | Estado PO |
|------|-----------------|-------------|-------------------|-----------|
| Happy | No | No | COMPLETED | APPROVED |
| Budget rejected | No | Sí (cerrar) | COMPENSATED_BUDGET_REJECTED | REJECTED |
| Timeout humano + auto-reject | No | Sí | TIMED_OUT | REJECTED |
| Timeout commit desconocido | Tal vez tras reconcile | No hasta decidir | NEEDS_RECOVERY | SUBMITTED |
| Kafka down | No | No | (sigue) | según sync |
| WF start fail | No | N/A | FAILED_START_WF | DRAFT |
| Doc fail pre-submit | No | N/A | — | DRAFT |
| Doc fail post-commit | No | No | COMPLETED_WITH_DOC_PENDING | APPROVED |

## 3.8 Diagrama de compensación (Budget committed luego cancelación de negocio)

```text
CancelPurchaseOrder
  → ReleaseBudget (idempotent)
  → Cancel/Close WF if open
  → Mark CANCELLED
  → Audit CANCELLED + BudgetReleased
```

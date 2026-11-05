# 6. Estrategia de recuperación e idempotencia
## SAGA-MVP-001

## 6.1 Idempotencia — definición operativa

> Un comando/evento es **idempotente** si aplicarlo **N veces con la misma clave lógica** produce el **mismo efecto de negocio** que aplicarlo una vez (sin duplicar side-effects).

En esta saga la idempotencia evita:

- Doble compromiso presupuestal  
- Doble inicio de proceso WF  
- Doble APPROVED  
- Doble fact de auditoría “clon” no intencional  
- Reprocesos Kafka at-least-once

---

## 6.2 Capas de idempotencia

| Capa | Mecanismo | Clave |
|------|-----------|-------|
| HTTP comandos críticos | Header `Idempotency-Key` + tabla `idempotency_record` | `(tenant_id, idempotency_key)` |
| Commit/Release budget | Misma key + unique parcial en `budget_movement.idempotency_key` | key + body hash |
| Eventos Kafka | Inbox `(event_id, consumer_name)` | `eventId` |
| Outbox publish | Publicar una vez por outbox row | `outbox.id` |
| Saga transition | Optimistic lock `version` + guard de estado | `sagaId` + expected state |
| Audit ingest | Idempotency-Key / natural key opcional | key |

### Ejemplo CommitBudget

```text
Idempotency-Key = "{sagaId}:commit"
1ª llamada → insert movement COMMIT + 200 COMMITTED + store response
2ª llamada (retry/timeout) → mismo response, NO segundo movement
Body distinto + misma key → 409 CONFLICT
```

### Ejemplo WorkflowApproved reentregado

```text
Consumer ve eventId E1 otra vez → inbox hit → no-op
Aunque re-ejecutara orquestador: CommitBudget con misma key → safe
```

---

## 6.3 Estrategia de recuperación

### 6.3.1 Principios

1. **SoT de fondos = budget-service** (sync), no Kafka.  
2. **SoT de saga = procurement** (estado + version).  
3. Recuperación es **reconciliación**, no “replay ciego” sin guards.  
4. Toda recuperación deja **AuditFact**.  
5. Alertar `NEEDS_RECOVERY` a Ops (métrica/alerta DoD).

### 6.3.2 Recovery jobs (lógicos)

| Job | Detecta | Acción |
|-----|---------|--------|
| `reconcile-commit` | Saga COMMITTING/NEEDS_RECOVERY > T | Consultar movements por `referenceId` o re-`CommitBudget` misma key |
| `reconcile-wf` | SUBMITTED sin processInstance / WF RUNNING huérfano | Lookup by businessRef; relink o restart idempotente |
| `outbox-publisher` | published_at IS NULL | Publicar a Kafka |
| `inbox-retry` | processed_at null / error | Reintentar handler idempotente |
| `doc-pending` | COMPLETED_WITH_DOC_PENDING | Reintentar ConfirmDocumentLinkage |
| `sla-timeout` | AWAITING_APPROVAL > SLA | Política escalate/auto-reject |

### 6.3.3 Algoritmo reconcile-commit

```text
given sagaId, poId, key=sagaId+":commit"
movements = budget.findByReference(PURCHASE_ORDER, poId)
if exists COMMIT not released:
    transition → CONFIRMING_DOCS / MarkApproved if needed
else if last response stored INSUFFICIENT_FUNDS:
    transition → COMPENSATED_BUDGET_REJECTED
else:
    call CommitBudget(key)  // safe
    branch on result
audit RECOVERY_ACTION
```

### 6.3.4 Recuperación por falla Kafka

| Situación | Recuperación |
|-----------|--------------|
| Outbox atrasado | Publisher; consumidores alcanzan consistencia eventual |
| DLQ | Fix + replay; inbox evita doble aplicación |
| Consumer rewind | Dedup por eventId |

**No** ejecutar ReleaseBudget solo porque Kafka falló.

### 6.3.5 Recuperación por falla Workflow

| Situación | Recuperación |
|-----------|--------------|
| Start falló | Re-submit/start con misma Idempotency-Key |
| Approve event perdido | Re-completo de tarea (idempotent) o admin complete |
| WF DB restore | Reconciliar businessRef ↔ processInstanceId |

### 6.3.6 Recuperación por falla Document

| Situación | Recuperación |
|-----------|--------------|
| Pre-submit | Usuario reintenta upload; submit bloqueado |
| Post-commit | Job `doc-pending`; no tocar budget |

---

## 6.4 Timeouts y reintentos (política MVP)

| Operación | Retries | Backoff | Luego |
|-----------|---------|---------|-------|
| CommitBudget sync | 3 | 50–200ms | NEEDS_RECOVERY |
| StartProcess | 3 | 100–500ms | FAILED_START_WF |
| IngestAuditFact | 5 | exp | cola local / outbox bridge |
| ConfirmDocumentLinkage | 5 | exp | DOC_PENDING |
| Kafka publish outbox | ∞ (con jitter) | exp capped | alerta lag |

---

## 6.5 Observabilidad de saga

Métricas mínimas:

- `saga_active{state}`
- `saga_transitions_total{from,to}`
- `saga_needs_recovery`
- `saga_compensation_total{reason}`
- `commit_budget_idempotent_replay_total`

Logs: `sagaId`, `correlationId`, `tenantId`, `poId`, `state`, `idempotencyKey`.

---

## 6.6 Resumen ejecutivo

| Pregunta | Respuesta |
|----------|-----------|
| ¿Quién orquesta? | `procurement-service` |
| ¿Qué es síncrono crítico? | `CommitBudget` |
| ¿Qué es asíncrono? | Eventos espejo, audit bridge, proyecciones |
| ¿Cómo no duplicar fondos? | Idempotency-Key + unique movement |
| ¿Cómo no perder el happy path si Kafka cae? | Outbox + decisión sync |
| ¿Qué nunca se “rollbackea” borrando? | Audit trail |
| ¿Compensación de fondos? | `ReleaseBudget` |

# 4. Definición de Transiciones
## BPM-001

## 4.1 Estructura de una transición

```text
TransitionDef:
  id
  fromNode
  toNode
  onEvent          # APPROVE | REJECT | EXPIRE | SIGN | SYSTEM_OK | ...
  guardRuleRef     # opcional — motor de reglas
  priority         # para gateways
  auto             # true si system
  audit            # always true
```

## 4.2 Tabla de transiciones genéricas (plantilla Approval+Signature)

| From | Event | Guard | To | Side effects |
|------|-------|-------|----|--------------|
| START | `process.started` | — | REQUEST_VALIDATION (system) | create instance audit |
| REQUEST_VALIDATION | `SYSTEM_OK` | payload valid | REVIEW_OR_APPROVAL_GATEWAY | — |
| REQUEST_VALIDATION | `SYSTEM_FAIL` | — | END_REJECTED | notify starter |
| GATEWAY_AMOUNT | `EVAL` | amount ≤ U0 | APPROVAL_L1 | create task jefe |
| GATEWAY_AMOUNT | `EVAL` | U0 < amount ≤ U1 | APPROVAL_L2 | create task director |
| GATEWAY_AMOUNT | `EVAL` | amount > U1 | APPROVAL_L2 then APPROVAL_L3 | cadena |
| APPROVAL_Lx | `APPROVE` | actor in candidates AND amount≤limit AND orgScope | NEXT or SIGNATURE | notify |
| APPROVAL_Lx | `REJECT` | reason required | END_REJECTED / RETURN_TO_REQUESTER | notify + domain event |
| APPROVAL_Lx | `EXPIRE` | SLA | ESCALATION_NODE | reassign/escalate |
| SIGNATURE | `SIGN` | signatureRef valid | SYSTEM_POST_APPROVE | link document |
| SIGNATURE | `REJECT`/`EXPIRE` | — | END_REJECTED / escalate | — |
| SYSTEM_POST_APPROVE | `SYSTEM_OK` | e.g. BudgetCommitted | END_COMPLETED | domain ProcessApproved |
| SYSTEM_POST_APPROVE | `SYSTEM_FAIL` | — | COMPENSATION / RETURN | Release holds |

## 4.3 Patrones de transición reutilizables

### P1 — Linear Approval
`Start → Approve L1 → End`

### P2 — Multi-level Approval
`Start → L1 → L2 → L3 → End` (niveles por reglas de monto)

### P3 — Review then Approve
`Start → Review → Approve → End`

### P4 — Approve then Sign
`… → Approve → Signature → System → End`

### P5 — Parallel Review (split/join)
`Split → (Legal Review | Tech Review) → Join → Approve`

### P6 — Return for changes
`Approve/Review --REQUEST_CHANGES→ RequesterTask --SUBMIT→ back`

### P7 — Escalation loop
`Task --EXPIRE→ EscalateTask → new Assignee Task`

## 4.4 Guards obligatorios en toda transición humana

1. Instancia no terminal  
2. Task ASSIGNED/IN_PROGRESS del actor (o candidato claim)  
3. Tenant match  
4. OrgScope / department policy  
5. SoD (si aplica)  
6. MFA obligation si la regla lo exige  

## 4.5 Eventos de dominio emitidos por transiciones

| Transición | Domain Event |
|------------|--------------|
| Start | `ProcessStarted` |
| Task created | `TaskCreated` |
| Task completed | `TaskCompleted` |
| Reject | `TaskRejected` / `ProcessRejected` |
| Escalate | `TaskEscalated` |
| Sign | `SignatureCompleted` |
| End OK | `ProcessCompleted` |
| Cancel | `ProcessCancelled` |

Consumidores: Purchasing, Budget, Document, Notification, Audit.

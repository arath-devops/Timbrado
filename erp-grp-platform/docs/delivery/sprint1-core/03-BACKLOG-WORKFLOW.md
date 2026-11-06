# 3. Backlog detallado — Workflow
## BL-S1-CORE-001

**Epic:** `E-WF-S1` — Aprobación/rechazo simple Sprint 1  
**Servicio:** `workflow-service`  
**Proceso único:** `PO_APPROVAL`  
**DoD:** DoD-001 · OpenAPI `shared/openapi/workflow/v1.yaml` · DDL `database/flyway/workflow/`

---

### WF-001 — Schema + definición PO_APPROVAL
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 3 |
| Como | equipo |
| Quiero | migraciones y definition seed de un solo paso humano |
| Para | arrancar procesos |
| AC | Tablas process_definition/instance/task; definition activa `PO_APPROVAL` v1; candidateRoles = `[PUR_MANAGER, PUR_DIRECTOR]` (configurable en JSON definición); **sin** nodos SLA |
| Out | Diseñador BPMN, multi-etapa |

### WF-002 — StartProcess
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 5 |
| Como | procurement (cliente) |
| Quiero | iniciar `PO_APPROVAL` con businessRef |
| Para | crear tarea de aprobación |
| AC | `POST /processes/PO_APPROVAL/start` + Idempotency-Key; variables amount/currency/orgUnitId/caseFileId; estado RUNNING; crea Task OPEN; evento `WorkflowStarted`; replay idempotente |
| Depende | WF-001, IAM JWT |

### WF-003 — Inbox de tareas
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 3 |
| Como | aprobador |
| Quiero | listar mis tareas abiertas |
| Para | atender aprobaciones |
| AC | `GET /tasks?assigneeMe=true&status=OPEN`; filtra por tenant + intersection roles JWT ∩ candidateRoles; paginación |
| Depende | WF-002 |

### WF-004 — Aprobar con comentario
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 5 |
| Como | aprobador |
| Quiero | aprobar una tarea y dejar comentario |
| Para | autorizar la compra |
| AC | `POST /tasks/{id}/complete` body `{ outcome: APPROVE, comment }`; comment persistido (hasta 1000 chars); task COMPLETED; process COMPLETED; evento `WorkflowApproved` con comment; Idempotency-Key Must |
| Depende | WF-003 |

### WF-005 — Rechazar con comentario
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P0 |
| Pts | 5 |
| Como | aprobador |
| Quiero | rechazar una tarea con motivo |
| Para | devolver la solicitud |
| AC | outcome REJECT; comment recomendado (AC: si vacío, warning o default "Sin comentario"); process REJECTED; evento `WorkflowRejected` con reason/comment |
| Depende | WF-003 |

### WF-006 — GET process / task detalle
| Campo | Valor |
|-------|--------|
| Tipo | Story |
| Prioridad | P1 |
| Pts | 2 |
| Como | sistema/auditor operativo |
| Quiero | consultar instancia y tarea |
| Para | soporte y UI mínima |
| AC | `GET /processes/{id}`; task incluye comment/outcome; 404 cross-tenant |
| Depende | WF-002 |

### WF-007 — Outbox eventos workflow
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 3 |
| Como | plataforma |
| Quiero | publicar Started/Approved/Rejected |
| Para | saga procurement |
| AC | Schemas EDA-MVP; key tenantId:processInstanceId; outbox TX |
| Depende | WF-002, WF-004, WF-005 |

### WF-008 — Idempotencia y guards de estado
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 3 |
| Como | equipo |
| Quiero | impedir doble complete y complete sobre CLOSED |
| Para | consistencia saga |
| AC | 409 si task no OPEN (salvo replay key); tests unitarios de estado |
| Depende | WF-004, WF-005 |

### WF-009 — Tests DoD + RLS
| Campo | Valor |
|-------|--------|
| Tipo | Enabler |
| Prioridad | P0 |
| Pts | 5 |
| Como | equipo |
| Quiero | coverage, IT Testcontainers, cross-tenant |
| Para | Done |
| AC | DoD-001 gates; OpenAPI alineada |
| Depende | WF-001–008 |

### WF-010 (OUT) — SLA / BPM complejo / motor reglas
| Campo | Valor |
|-------|--------|
| Tipo | **Excluido** |
| Pts | 0 |
| Nota | No timers, no DMN, no parallel gateway, no reassign avanzado |

---

## Totales Workflow

| Prioridad | Pts aprox. |
|-----------|------------|
| P0 | 29 |
| P1 | 2 |
| **Total** | **~31** |

## Contrato de comentario (congelado)

```json
{
  "outcome": "APPROVE | REJECT",
  "comment": "string|null max 1000"
}
```

Persistencia: `task.comment_text`.  
Eventos: incluir `comment` / `reason` en payload Approved/Rejected.

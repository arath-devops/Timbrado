# 3. Definición de Estados
## BPM-001

## 3.1 Estados de ProcessInstance

| Estado | Significado | Terminal |
|--------|-------------|----------|
| `STARTING` | Creada; inicializando token | No |
| `RUNNING` | Ejecutando nodos system/gateway | No |
| `WAITING_HUMAN` | Esperando USER/REVIEW/APPROVAL/SIGNATURE | No |
| `WAITING_SYSTEM` | Esperando callback/system task | No |
| `ESCALATED` | Fuera de SLA; en tratamiento de escalamiento | No |
| `COMPLETED` | Finalizado por camino feliz | **Sí** |
| `REJECTED` | Finalizado por rechazo | **Sí** |
| `CANCELLED` | Cancelado por usuario/sistema | **Sí** |
| `ERROR` | Fallo técnico reintentable o dead-letter | No* |

\*ERROR puede resolverse a RUNNING/CANCELLED; si se vuelve terminal, requiere intervención ops.

## 3.2 Estados de Task

| Estado | Significado |
|--------|-------------|
| `PENDING` | Creada; sin asignar o en cola de candidatos |
| `ASSIGNED` | Asignada a usuario |
| `IN_PROGRESS` | Claimed / en trabajo |
| `COMPLETED` | Outcome exitoso (`APPROVED`, `REVIEWED_OK`, `SIGNED`) |
| `REJECTED` | Outcome negativo |
| `EXPIRED` | Venció SLA de tarea |
| `ESCALATED` | Reasignada por política |
| `CANCELLED` | Ya no aplica (proceso cancelado o camino alterno) |

## 3.3 Estados de Signature (subciclo)

| Estado | Significado |
|--------|-------------|
| `AWAITING_SIGNATURE` | Pendiente firmante |
| `SIGNED` | Firma válida registrada (Document BC) |
| `SIGNATURE_REJECTED` | Firmante rechaza |
| `SIGNATURE_EXPIRED` | No firmó a tiempo → escalamiento |

## 3.4 Outcomes canónicos (resultado de CompleteTask)

| outcome | Uso típico |
|---------|------------|
| `SUBMIT` | Enviar a revisión/aprobación |
| `APPROVE` | Aprobar |
| `REJECT` | Rechazar |
| `REQUEST_CHANGES` | Devolver a solicitante |
| `REVIEW_OK` | Revisión conforme |
| `REVIEW_FAIL` | Revisión no conforme |
| `SIGN` | Firmar |
| `ACK` | Enterado |
| `SYSTEM_OK` / `SYSTEM_FAIL` | Tareas automáticas |

## 3.5 Mapeo a estados de negocio (ejemplo PO)

| Evento Workflow | Estado sugerido en Purchasing |
|-----------------|-------------------------------|
| ProcessStarted | `IN_APPROVAL` |
| TaskRejected / ProcessRejected | `REJECTED` / `DRAFT` |
| ProcessCompleted (approved) | `APPROVED` (tras BudgetCommitted) |
| ProcessCancelled | `CANCELLED` |

**Justificación:** el dominio conserva su propio status; el workflow emite hechos. Evita doble fuente de verdad.

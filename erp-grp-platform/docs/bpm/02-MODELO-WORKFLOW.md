# 2. Modelo de Workflow
## BPM-001

## 2.1 Metamodelo

```mermaid
classDiagram
  class ProcessDefinition {
    key
    version
    name
    module
    category
    status PUBLISHED
  }
  class ProcessNode {
    nodeId
    nodeType
    name
  }
  class TransitionDef {
    fromNode
    toNode
    event
    guardRuleRef
  }
  class SlaPolicy {
    targetDuration
    warnBefore
    escalateAfter
    calendarRef
  }
  class ProcessInstance {
    id
    definitionKey
    definitionVersion
    businessRef
    status
    correlationId
  }
  class Token {
    nodeId
    status
  }
  class Task {
    id
    taskType
    assignee
    candidateGroups
    status
    dueAt
  }
  class TransitionLog {
    from
    to
    actor
    comment
    occurredAt
  }
  class WorkflowPayload {
    variables
    amount
    orgUnitId
    departmentId
  }

  ProcessDefinition "1" --> "*" ProcessNode
  ProcessDefinition "1" --> "*" TransitionDef
  ProcessDefinition "0..1" --> "0..*" SlaPolicy
  ProcessInstance --> ProcessDefinition
  ProcessInstance "1" --> "*" Token
  ProcessInstance "1" --> "*" Task
  ProcessInstance "1" --> "*" TransitionLog
  ProcessInstance --> WorkflowPayload
  Task --> SlaPolicy : applies
```

## 2.2 Conceptos

| Concepto | Definición |
|----------|------------|
| **ProcessDefinition** | Plantilla versionada del flujo (p.ej. `PO_APPROVAL:v3`) |
| **ProcessInstance** | Caso en ejecución ligado a un *businessRef* (`purchasing:PurchaseOrder:uuid`) |
| **Node** | Paso: START, USER_TASK, SYSTEM_TASK, SIGNATURE_TASK, REVIEW_TASK, GATEWAY, END |
| **Token** | Cursor de ejecución (soporta split/join simple en gateways) |
| **Task** | Unidad de trabajo humana o de sistema |
| **Transition** | Arco disparado por evento (`APPROVE`, `REJECT`, `EXPIRE`, `SIGN`, `SYSTEM_OK`) |
| **Variables** | Payload tipado mínimo para routing (monto, OU, depto, módulo, criticidad) |
| **BusinessRef** | Puntero al aggregate externo — sin poseer su estado de negocio |

## 2.3 Tipos de tarea

| taskType | Uso | Ejemplos |
|----------|-----|----------|
| `REQUEST` | Captura/solicitud inicial | Alta requisición ya creada dispara start; o tarea de completar datos |
| `REVIEW` | Revisión sin autoridad final | Revisión técnica / jurídica |
| `APPROVAL` | Aprobación con efecto | Jefe / Director / BUD_APPROVER |
| `REJECTION_HANDLING` | Corrección post-rechazo | Devolver a capturista |
| `SIGNATURE` | Firma electrónica / visto bueno formal | Firma de OC / dictamen |
| `SYSTEM` | Integración automática | `CommitBudget`, virus-scan doc, notify |
| `ACKNOWLEDGEMENT` | Enterado | Notificación con acuse |

## 2.4 Ciclo de vida de instancia (vista)

```mermaid
stateDiagram-v2
  [*] --> STARTING
  STARTING --> RUNNING: token en primer nodo
  RUNNING --> WAITING_HUMAN: user/signature task
  WAITING_HUMAN --> RUNNING: complete/reject/sign
  RUNNING --> WAITING_SYSTEM: system task
  WAITING_SYSTEM --> RUNNING: system callback
  RUNNING --> ESCALATED: SLA breach
  ESCALATED --> WAITING_HUMAN: reassigned
  RUNNING --> COMPLETED: end approve path
  RUNNING --> REJECTED: end reject path
  RUNNING --> CANCELLED: cancel command
  COMPLETED --> [*]
  REJECTED --> [*]
  CANCELLED --> [*]
```

## 2.5 API conceptual del motor (contratos, no código)

| Command | Efecto |
|---------|--------|
| `DeployDefinition` | Publica versión |
| `StartProcess(defKey, businessRef, variables, starter)` | Crea instancia + primera task |
| `ClaimTask` / `AssignTask` | Asignación |
| `CompleteTask(outcome, comment, attachments)` | Dispara transición |
| `RejectTask(reason)` | Camino de rechazo |
| `SignTask(signatureRef)` | Completa SIGNATURE |
| `CancelProcess(reason)` | Fin anormal |
| `ReassignTask` / `EscalateTask` | Manual o por SLA |
| Query `Inbox(user)` / `ProcessStatus(businessRef)` | Read models |

## 2.6 Justificación del modelo

Separar **definition/instance/task** permite: (1) reutilizar el mismo motor en ERP y GRP, (2) versionar umbrales sin migrar casos abiertos, (3) auditar cada transición, (4) integrar firmas y sistemas como nodos de primera clase — patrón Camunda + Approvals Management.

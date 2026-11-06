# `workflow-service`
## SA-MS-001 · Capa **Core** · Prioridad: **MVP**

### Responsabilidad
Motor BPM: definiciones versionadas, instancias, tasks humanas/system, reglas de routing, SLA, escalamiento y correlación con businessRef.

### Límites (Bounded Context)

**Posee / es dueño de:**
- ProcessDefinition
- ProcessInstance
- Task
- SlaPolicy
- TransitionLog
- Ruleset bindings

**No posee / no debe hacer:**
- Estado de negocio del PO/Budget (solo orquesta)
- Firma criptográfica (delega a document-service)
- Envío SMTP directo

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/definitions` | Deploy definición |
| `POST` | `/api/v1/processes` | StartProcess |
| `GET` | `/api/v1/processes/{id}` | Estado instancia |
| `GET` | `/api/v1/processes/by-business-ref` | Lookup |
| `GET` | `/api/v1/tasks/inbox` | Inbox usuario |
| `POST` | `/api/v1/tasks/{id}/claim` | Claim |
| `POST` | `/api/v1/tasks/{id}/complete` | Complete/Approve/Reject/Sign outcome |
| `POST` | `/api/v1/tasks/{id}/reassign` | Reasignar |
| `POST` | `/api/v1/processes/{id}/cancel` | Cancelar |

### Eventos publicados
- `ProcessStarted`
- `TaskCreated`
- `TaskCompleted`
- `TaskRejected`
- `TaskEscalated`
- `ProcessCompleted`
- `ProcessRejected`
- `ProcessCancelled`
- `ReminderSent`

### Eventos consumidos
- `DocumentSigned`
- `BudgetCommitted`
- `BudgetCommitFailed`
- `PurchaseRequisitionCreated (policy start)`
- `PurchaseOrderSubmitted (policy start)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `workflow_db`
- Regla: acceso exclusivo de `workflow-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version` (optimistic lock)

### Dependencias
- `PostgreSQL`
- `Kafka`
- `Redis`
- `IAM`
- `document-service`
- `budget-service (system tasks)`
- `notification-service`
- `Rules config`

### Notas de contrato
Unique active process per (businessRef, processKey). System tasks llaman APIs sync con timeout+compensación.

# workflow-service — Modelo de datos MVP
## DA-MVP-001 · Database `workflow_db`

### 1. Conceptual
Definición, instancia y tareas BPM

### 2. Lógico
ProcessDefinition 1—N ProcessInstance 1—N Task

Detalle de atributos: [03-LOGICAL.md](../03-LOGICAL.md) § correspondiente.

### 3. Físico
**Tablas:** process_definition, process_instance, task + outbox/inbox/idempotency

**DDL:** [`database/flyway/workflow/V1__init_mvp.sql`](../../../../database/flyway/workflow/V1__init_mvp.sql)

**ERD:** [../erd/workflow.md](../erd/workflow.md)

### Decisiones clave
businessRef columns; CASCADE tasks on instance delete

### Audit fields
Plantilla estándar (`created_at/by`, `updated_at/by`, `version`) salvo excepciones append-only documentadas en [01-CONVENTIONS-DECISIONS.md](../01-CONVENTIONS-DECISIONS.md).

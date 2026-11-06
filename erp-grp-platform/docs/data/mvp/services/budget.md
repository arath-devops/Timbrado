# budget-service — Modelo de datos MVP
## DA-MVP-001 · Database `budget_db`

### 1. Conceptual
Ciclo, partida y movimientos de fondos

### 2. Lógico
Cycle 1—N Allocation 1—N Movement

Detalle de atributos: [03-LOGICAL.md](../03-LOGICAL.md) § correspondiente.

### 3. Físico
**Tablas:** budget_cycle, budget_allocation, budget_movement + outbox/inbox/idempotency

**DDL:** [`database/flyway/budget/V1__init_mvp.sql`](../../../../database/flyway/budget/V1__init_mvp.sql)

**ERD:** [../erd/budget.md](../erd/budget.md)

### Decisiones clave
CHECK authorized>=committed>=accrued>=paid; UNIQUE idempotency_key partial

### Audit fields
Plantilla estándar (`created_at/by`, `updated_at/by`, `version`) salvo excepciones append-only documentadas en [01-CONVENTIONS-DECISIONS.md](../01-CONVENTIONS-DECISIONS.md).

# procurement-service — Modelo de datos MVP
## DA-MVP-001 · Database `procurement_db`

### 1. Conceptual
Requisición y Orden de compra

### 2. Lógico
REQ 1—N lines; PO 1—N lines; REQ 0—1 PO

Detalle de atributos: [03-LOGICAL.md](../03-LOGICAL.md) § correspondiente.

### 3. Físico
**Tablas:** purchase_requisition[_line], purchase_order[_line] + outbox/inbox/idempotency

**DDL:** [`database/flyway/procurement/V1__init_mvp.sql`](../../../../database/flyway/procurement/V1__init_mvp.sql)

**ERD:** [../erd/procurement.md](../erd/procurement.md)

### Decisiones clave
Soft refs allocation_id/case_file_id/budget_movement_id; status machine CHECK

### Audit fields
Plantilla estándar (`created_at/by`, `updated_at/by`, `version`) salvo excepciones append-only documentadas en [01-CONVENTIONS-DECISIONS.md](../01-CONVENTIONS-DECISIONS.md).

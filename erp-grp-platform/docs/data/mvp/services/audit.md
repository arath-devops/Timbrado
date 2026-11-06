# audit-service — Modelo de datos MVP
## DA-MVP-001 · Database `audit_db`

### 1. Conceptual
Hecho auditable inmutable

### 2. Lógico
AuditFact append-only

Detalle de atributos: [03-LOGICAL.md](../03-LOGICAL.md) § correspondiente.

### 3. Físico
**Tablas:** audit_fact + idempotency_record

**DDL:** [`database/flyway/audit/V1__init_mvp.sql`](../../../../database/flyway/audit/V1__init_mvp.sql)

**ERD:** [../erd/audit.md](../erd/audit.md)

### Decisiones clave
No updated_*/version; index entity timeline; revoke UPDATE in ops

### Audit fields
Plantilla estándar (`created_at/by`, `updated_at/by`, `version`) salvo excepciones append-only documentadas en [01-CONVENTIONS-DECISIONS.md](../01-CONVENTIONS-DECISIONS.md).

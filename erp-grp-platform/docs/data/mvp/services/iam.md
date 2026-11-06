# iam-service — Modelo de datos MVP
## DA-MVP-001 · Database `iam_db`

### 1. Conceptual
Usuario, Rol, OrgScope, Sesión

### 2. Lógico
UserAccount 1—N Role via UserRole; OrgScopeGrant; Session

Detalle de atributos: [03-LOGICAL.md](../03-LOGICAL.md) § correspondiente.

### 3. Físico
**Tablas:** user_account, role, user_role, org_scope_grant, session + outbox/inbox/idempotency

**DDL:** [`database/flyway/iam/V1__init_mvp.sql`](../../../../database/flyway/iam/V1__init_mvp.sql)

**ERD:** [../erd/iam.md](../erd/iam.md)

### Decisiones clave
UK (tenant_id, username); status CHECK; soft ref created_by

### Audit fields
Plantilla estándar (`created_at/by`, `updated_at/by`, `version`) salvo excepciones append-only documentadas en [01-CONVENTIONS-DECISIONS.md](../01-CONVENTIONS-DECISIONS.md).

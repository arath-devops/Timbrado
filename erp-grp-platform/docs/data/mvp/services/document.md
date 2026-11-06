# document-service — Modelo de datos MVP
## DA-MVP-001 · Database `document_db`

### 1. Conceptual
Expediente, documento metadatos, vínculo

### 2. Lógico
CaseFile 1—N DocumentItem 1—N DocumentLink

Detalle de atributos: [03-LOGICAL.md](../03-LOGICAL.md) § correspondiente.

### 3. Físico
**Tablas:** case_file, document_item, document_link + outbox/inbox

**DDL:** [`database/flyway/document/V1__init_mvp.sql`](../../../../database/flyway/document/V1__init_mvp.sql)

**ERD:** [../erd/document.md](../erd/document.md)

### Decisiones clave
storage_key for object storage; binary out of PG

### Audit fields
Plantilla estándar (`created_at/by`, `updated_at/by`, `version`) salvo excepciones append-only documentadas en [01-CONVENTIONS-DECISIONS.md](../01-CONVENTIONS-DECISIONS.md).

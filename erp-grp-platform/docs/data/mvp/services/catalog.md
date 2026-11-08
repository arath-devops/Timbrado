# catalog-service — Modelo de datos MVP
## DA-MVP-001 · Database `catalog_db`

### 1. Conceptual
Tipo de catálogo e ítems maestros

### 2. Lógico
CatalogType 1—N CatalogItem

Detalle de atributos: [03-LOGICAL.md](../03-LOGICAL.md) § correspondiente.

### 3. Físico
**Tablas:** catalog_type, catalog_item + outbox/inbox

**DDL:** [`database/flyway/catalog/V1__init_mvp.sql`](../../../../database/flyway/catalog/V1__init_mvp.sql)

**ERD:** [../erd/catalog.md](../erd/catalog.md)

### Decisiones clave
UK (tenant_id, type_code, code); GIN on attributes; deactivate not delete

### Audit fields
Plantilla estándar (`created_at/by`, `updated_at/by`, `version`) salvo excepciones append-only documentadas en [01-CONVENTIONS-DECISIONS.md](../01-CONVENTIONS-DECISIONS.md).

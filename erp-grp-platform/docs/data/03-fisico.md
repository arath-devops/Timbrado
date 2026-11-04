# Modelo Físico PostgreSQL

## Índices estándar
- `(tenant_id, id)`
- `(tenant_id, status)`
- `(tenant_id, created_at DESC)`
- Únicos de negocio: `(tenant_id, code)` / `(tenant_id, number)`
- GiST/GIN para JSONB de búsqueda

## Particionamiento
- `audit_fact` por mes
- `notification` por mes
- `journal_entry` por año fiscal (si volumen)

## RLS (shared schema mode)
```sql
ALTER TABLE journal_entry ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON journal_entry
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

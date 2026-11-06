# Modelo Lógico (estándares)

## Convención de tablas
- snake_case, singular agregado raíz: `journal_entry`, `purchase_order`
- PK: `id UUID`
- FK internas: `<entity>_id UUID`
- Referencias externas: `<context>_<entity>_id UUID` (sin FK física)
- Multitenancy: `tenant_id UUID NOT NULL`
- Optimistic locking: `version BIGINT NOT NULL`
- Auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`
- Soft delete (si aplica): `deleted_at TIMESTAMPTZ NULL`

## Tipos
| Concepto | Tipo |
|----------|------|
| Dinero | `NUMERIC(19,4)` + `currency CHAR(3)` |
| Cantidad | `NUMERIC(19,6)` |
| Código de negocio | `VARCHAR(64)` |
| i18n | tabla `*_i18n` o JSONB `labels` |
| Estado | `VARCHAR(32)` + CHECK |

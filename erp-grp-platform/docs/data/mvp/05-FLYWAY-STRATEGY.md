# 5. Estrategia de migraciones Flyway
## DA-MVP-001

## 5.1 Layout

```text
database/flyway/
  iam/V1__init_mvp.sql
  catalog/V1__init_mvp.sql
  audit/V1__init_mvp.sql
  workflow/V1__init_mvp.sql
  document/V1__init_mvp.sql
  procurement/V1__init_mvp.sql
  budget/V1__init_mvp.sql
  README.md
```

Cada servicio apunta Flyway a **su** carpeta y **su** JDBC URL (`jdbc:postgresql://.../iam_db`, etc.).

## 5.2 Versionado

| Regla | Detalle |
|-------|---------|
| Baseline | `V1__init_mvp.sql` — crea todo el schema Sprint 1 |
| Incrementos | `V2__<descripcion>.sql`, `V3__...` — solo forward |
| Naming | `V{version}__{snake_description}.sql` (doble underscore) |
| Repeatable | `R__seed_catalog_types.sql` solo para seeds idempotentes de referencia (opcional) |
| Undo | **No** usar Undo migrations en MVP; rollback = restore backup / recrear env int |
| Checksum | Nunca editar un `V*` ya aplicado en int/prod; crear `Vn+1` correctivo |

## 5.3 Orden de apply en entorno nuevo

```text
1. Provisionar databases vacíos (Terraform/script ops)
2. Flyway migrate iam → catalog → audit → workflow → document → budget → procurement
3. Seeds: R__ o job de seed (tenant, roles, partidas demo) — fuera de V1 o en R__ controlado
```

Justificación del orden: igual que oleadas DoD/DoR (IAM primero; procurement al final).

## 5.4 Contenido mínimo de V1

1. Extensiones si aplica (`CREATE EXTENSION IF NOT EXISTS pgcrypto` — opcional).  
2. Tablas de negocio + constraints + indexes.  
3. Tablas infra: `outbox`, `inbox`, `idempotency_record` según servicio.  
4. Comentarios `COMMENT ON TABLE/COLUMN` para ownership.  
5. **No** datos de municipio real en V1 (seed separado aprobado por PO).

## 5.5 CI (DoD)

| Check | Acción |
|-------|--------|
| `flyway clean migrate` (o Testcontainers) | Obligatorio en CI del servicio |
| Drift | Fallar si schema runtime ≠ migraciones |
| Privilegios | App role: DML; migrate role: DDL (separación recomendada en int+) |

## 5.6 RLS (fase posterior)

Scripts `Vn__enable_rls.sql` opcionales:

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON <table>
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
```

No activar en V1 del piloto dedicated salvo decisión Ops.

## 5.7 Compatibilidad con schemas legacy

Los archivos `database/schemas/**/*.sql` previos son **borrador**.  
**Prevalece** `database/flyway/*/V1__init_mvp.sql` + este documento DA-MVP-001.

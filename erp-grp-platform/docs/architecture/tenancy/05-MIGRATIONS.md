# 5. Estrategia de migraciones multi-tenant
## CA-TEN-001

## 5.1 Principio

> **Una cadena Flyway por microservicio por Data Plane.**  
> No hay Flyway por tenant. El DDL es idéntico; los datos llevan `tenant_id`.

```text
database/flyway/{service}/
  V1__init_mvp.sql          -- tablas + tenant_id (DA-MVP)
  V2__enable_rls.sql        -- ENABLE/FORCE RLS + policies
  V3__...                   -- evoluciones de schema
```

Planes Dedicated y Shared aplican **las mismas** versiones; solo cambia el JDBC URL / secretos del plane.

## 5.2 V2 — RLS (canónico)

Plantilla por tabla de negocio:

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <table> FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON <table>
  AS PERMISSIVE
  FOR ALL
  TO {service}_app
  USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
```

| Tabla infra | RLS |
|-------------|-----|
| `outbox` | Sí (tiene `tenant_id`) |
| `inbox` | Sí |
| `idempotency_record` | Sí |
| `flyway_schema_history` | No (solo migrator) |

`FORCE ROW LEVEL SECURITY` asegura que incluso el table owner no ignore policies cuando usa rol app.

## 5.3 Roles y grants (Ops)

```sql
-- ejecutar una vez por DB (manual/ops script, no necesariamente Flyway app)
REVOKE BYPASSRLS FROM {service}_app;  -- default
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO {service}_app;
-- migrator retains bypass for DDL/data fixes
```

## 5.4 Seed de tenant

| Ambiente | Cómo |
|----------|------|
| Piloto dedicated | `R__seed_pilot_tenant.sql` o job: INSERT tenant + admin user + roles + catalogs + budget cycle |
| Shared SaaS | API Control Plane `POST /tenants` → seed asíncrono in-tenant |
| Tests | Testcontainers + seed UUID fijo |

Seeds **idempotentes** (`ON CONFLICT DO NOTHING` por codes).

## 5.5 Expand-contract y multi-tenant

| Cambio | Práctica |
|--------|----------|
| Nueva columna | Nullable → backfill job por tenant batches → NOT NULL |
| Nueva tabla | Incluir `tenant_id` + RLS en la misma versión |
| Índice | Crear concurrente en ops si tabla grande shared |
| Drop columna | Expand/contract clásico; verificar no leak cross-tenant en backfill |

## 5.6 Migración de un tenant entre planes

```text
SHARED → DEDICATED (o viceversa):
  1. Provision plane destino
  2. Flyway migrate destino (mismo version target)
  3. Export lógico WHERE tenant_id = :id (tablas ordenadas)
  4. Import + validate counts/checksums
  5. Cutover DNS / plane binding
  6. Freeze writes origen; dual-run short window
  7. Decommission data origen tras retención
```

No es “CREATE DATABASE per tenant” en caliente del path feliz SaaS; es **movimiento de plane**.

## 5.7 CI/CD

| Check | Acción |
|-------|--------|
| Flyway migrate vacío | OK |
| Test RLS | Conexión app sin `app.tenant_id` → 0 rows |
| Test cross-tenant | Insert A, select as B → empty |
| Canary Shared plane | Migrar un ambiente staging multi-tenant antes de prod shared |

## 5.8 Compatibilidad con V1 actual

`V1__init_mvp.sql` ya es compatible (columnas `tenant_id`).  
**Siguiente paso de implementación:** añadir `V2__enable_rls.sql` por servicio cuando se construyan los servicios (sin cambiar la decisión CA-TEN).

Piloto dedicated **igual** aplica V2: RLS con un solo tenant sigue siendo válida y prepara SaaS.

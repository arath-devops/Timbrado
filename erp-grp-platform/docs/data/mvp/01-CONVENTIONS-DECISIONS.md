# 1. Convenciones y decisiones justificadas
## DA-MVP-001

## 1.1 Decisiones transversales

| ID | Decisión | Justificación |
|----|----------|---------------|
| D-DA-01 | **DB-per-service** (7 databases) | Aísla fallos, permite evolucionar esquemas sin acoplamiento; alinea SA-MS / DoD |
| D-DA-02 | **Sin FK cross-service** | Evita transacciones distribuidas implícitas; integridad eventual vía eventos + IDs |
| D-DA-03 | PK = **UUID** (`uuid`) | IDs generables en app (UUIDv7 preferido en runtime); sin secuencias globales |
| D-DA-04 | Columna **`tenant_id uuid NOT NULL`** en tablas de negocio | Multi-tenant by design + piloto dedicated tenancy (EA-DEC D-02/D-03) |
| D-DA-05 | Audit fields: `created_at`, `created_by`, `updated_at`, `updated_by`, `version` | Trazabilidad local + optimistic locking; `created_by`/`updated_by` = UUID de usuario (soft ref a IAM) |
| D-DA-06 | Timestamps **`timestamptz`** | Evita ambigüedad de zona; contrato API usa ISO-8601 UTC |
| D-DA-07 | Dinero **`numeric(19,4)`** | Precisión exacta; API usa string decimal — misma escala |
| D-DA-08 | Estados como **`varchar` + CHECK** (no ENUM PG nativo) | Evolución de estados sin `ALTER TYPE` doloroso |
| D-DA-09 | Tabla **`outbox`** por servicio productor | Outbox pattern EDA-MVP; misma TX que el agregado |
| D-DA-10 | Tabla **`inbox`** por servicio consumidor | Dedup por `event_id` (at-least-once) |
| D-DA-11 | Tabla **`idempotency_record`** donde hay comandos críticos | Commit/release, audit ingest, start/complete WF, submit/cancel |
| D-DA-12 | Naming: `snake_case`, singular de agregado en tablas principales | Convención SQL del arquetipo; alineado a entidades Baseline |
| D-DA-13 | JSONB solo para atributos extensibles / variables WF / before-after audit | Flexibilidad sin proliferar columnas en Sprint 1 |
| D-DA-14 | RLS **preparado, no obligatorio** en tenant dedicado | Piloto = dedicated runtime; RLS listo si se pasa a shared schema |
| D-DA-15 | Flyway versionado `V1__init_mvp.sql` por servicio | Un baseline reproducible; cambios posteriores `V2__...` |

## 1.2 Audit fields (plantilla)

```sql
created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
created_by  UUID NOT NULL,
updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
updated_by  UUID NOT NULL,
version     BIGINT NOT NULL DEFAULT 0
```

| Excepción | Motivo |
|-----------|--------|
| `audit_fact` | Append-only: solo `occurred_at` / `recorded_at`; **sin** `updated_*` ni `version` de mutación |
| `budget_movement` | Append-only de movimiento: sin update de negocio; `created_*` basta |
| `outbox` / `inbox` | Infra técnica; campos propios de publicación/consumo |
| `idempotency_record` | Infra; `created_at` + `expires_at` |

## 1.3 Índices estándar

| Patrón | Uso |
|--------|-----|
| `UNIQUE (tenant_id, code)` | Códigos de negocio |
| `(tenant_id, status)` | Listados filtrados |
| `(tenant_id, created_at DESC)` | Timelines |
| Partial index `WHERE published_at IS NULL` | Outbox pending |
| `(tenant_id, entity_type, entity_id, recorded_at)` | Audit trail |

## 1.4 Qué no se modela en Sprint 1

| Omitido | Motivo (Scope Freeze) |
|---------|------------------------|
| MFA devices, SSO IdP links | OUT IAM |
| Accrue/pay columns operativas como flujos | Solo CHECK futuro; columnas `accrued`/`paid` en allocation quedan en **0** con CHECK completo para no romper invariante |
| Goods receipt / invoice tables | OUT procurement |
| OCR/signature/retention tables | OUT document |
| Particionamiento mensual audit | Documentado; implementar si volumen lo exige post-demo |

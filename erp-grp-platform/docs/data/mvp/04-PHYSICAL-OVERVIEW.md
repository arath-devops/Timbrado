# 4. Modelo físico — overview PostgreSQL
## DA-MVP-001

## 4.1 Estándares físicos

| Elemento | Estándar |
|----------|----------|
| Engine | PostgreSQL |
| Charset / collation | UTF8 / default cluster |
| PK | `id uuid PRIMARY KEY` |
| FK internas | `REFERENCES ... ON DELETE RESTRICT` (salvo cascadas justificadas en líneas) |
| Delete líneas hijas | `ON DELETE CASCADE` en line items de REQ/OC |
| Soft delete | Preferir status (`INACTIVE`, `CANCELLED`); no DELETE físico en agregados |
| Extensión | `pgcrypto` opcional; UUIDs generados en aplicación |

## 4.2 Tablas por database (resumen)

| DB | Tablas de negocio | Infra |
|----|-------------------|-------|
| iam_db | user_account, role, user_role, org_scope_grant, session | outbox, inbox, idempotency_record |
| catalog_db | catalog_type, catalog_item | outbox, inbox |
| audit_db | audit_fact | idempotency_record |
| workflow_db | process_definition, process_instance, task | outbox, inbox, idempotency_record |
| document_db | case_file, document_item, document_link | outbox, inbox |
| procurement_db | purchase_requisition, purchase_requisition_line, purchase_order, purchase_order_line | outbox, inbox, idempotency_record |
| budget_db | budget_cycle, budget_allocation, budget_movement | outbox, inbox, idempotency_record |

## 4.3 Constraints críticos

| DB | Constraint | Justificación |
|----|------------|---------------|
| budget | `CHECK (authorized >= committed AND committed >= accrued AND accrued >= paid)` | Invariante de fondos |
| budget | `CHECK (movement_type IN ('COMMIT','RELEASE'))` | Sprint 1 scope |
| budget | `UNIQUE (tenant_id, idempotency_key) WHERE idempotency_key IS NOT NULL` en movement o tabla idempotency | No doble commit |
| procurement | `CHECK (status IN (...))` | State machine cerrada |
| audit | Sin UPDATE/DELETE de app (privilegio DB revoke en prod) | Append-only |
| iam | `UNIQUE (tenant_id, username)` | Identidad local |

## 4.4 DDL canónico

Cada servicio: `database/flyway/<service>/V1__init_mvp.sql`

ERD Mermaid: `docs/data/mvp/erd/`

## 4.5 Justificación de columnas SoftRef (sin FK)

| Columna | Apunta a | Por qué no FK |
|--------|----------|---------------|
| `allocation_id` en procurement | `budget_db.budget_allocation` | Cross-service |
| `case_file_id` | `document_db.case_file` | Cross-service |
| `process_instance_id` | `workflow_db.process_instance` | Cross-service |
| `org_unit_id` | catálogo ORG_UNIT / org model | Catálogo u org; evita acoplar DDL |
| `supplier_code` | catalog SUPPLIER_BASIC | Código de negocio estable |
| `created_by` | iam user | Soft ref; IAM puede archivar usuarios |

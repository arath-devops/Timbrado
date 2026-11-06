# Arquitectura de Datos MVP
## DA-MVP-001

| Campo | Valor |
|-------|--------|
| Documento | DA-MVP-001 |
| Rol | Data Architect |
| Motor | **PostgreSQL 16+** (compatible 15+) |
| Alcance | 7 BDs del MVP: iam, catalog, audit, workflow, document, procurement, budget |
| Estado | Modelo físico listo para migraciones Flyway |
| Entradas | BL-S1-001, SA-MS-001, API-001, EDA-MVP-001, DoD-001 |

## Contenido

1. [Convenciones y decisiones justificadas](01-CONVENTIONS-DECISIONS.md)
2. [Modelo conceptual](02-CONCEPTUAL.md)
3. [Modelo lógico](03-LOGICAL.md)
4. [Modelo físico (overview)](04-PHYSICAL-OVERVIEW.md)
5. [ERD por servicio](erd/00-INDEX.md)
6. [Estrategia Flyway](05-FLYWAY-STRATEGY.md)
7. DDL: `database/flyway/{service}/V1__init_mvp.sql`

## Principio

> **Database-per-service.** Cada microservicio posee un database PostgreSQL exclusivo. No hay Foreign Keys entre servicios; solo referencias lógicas por UUID + `tenant_id`.

## Mapa DB ↔ servicio

| Database | Servicio | Schema físico |
|----------|----------|---------------|
| `iam_db` | iam-service | `database/flyway/iam/` |
| `catalog_db` | catalog-service | `database/flyway/catalog/` |
| `audit_db` | audit-service | `database/flyway/audit/` |
| `workflow_db` | workflow-service | `database/flyway/workflow/` |
| `document_db` | document-service | `database/flyway/document/` |
| `procurement_db` | procurement-service | `database/flyway/procurement/` |
| `budget_db` | budget-service | `database/flyway/budget/` |

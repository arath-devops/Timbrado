# `catalog-service`

| Campo | Valor |
|-------|-------|
| Capa | core |
| Responsabilidad | Catálogos maestros multiidioma versionados |
| Base de datos | PostgreSQL schema/database `catalog_db` |
| Dependencias | `PostgreSQL`, `Redis`, `Kafka` |
| Escalabilidad | HPA lectura; cache Redis L1/L2 |

## APIs
- `GET /api/v1/catalogs/{code}`
- `PUT /api/v1/catalogs/{code}/items`
- `GET /api/v1/catalogs/{code}/items`

## Eventos publicados
- `CatalogItemCreated`
- `CatalogItemUpdated`

## Eventos consumidos
- `TenantCreated`

## Métricas
- `catalog_cache_hit_ratio`
- `catalog_reads_total`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

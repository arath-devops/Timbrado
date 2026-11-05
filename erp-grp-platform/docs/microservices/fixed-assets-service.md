# `fixed-assets-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Alta, depreciación y baja de activos |
| Base de datos | PostgreSQL schema/database `fixed_assets_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | Batch mensual + API |

## APIs
- `POST /api/v1/assets`
- `POST /api/v1/assets/{id}/depreciate`
- `POST /api/v1/assets/{id}/dispose`

## Eventos publicados
- `AssetCreated`
- `AssetDepreciated`
- `AssetDisposed`

## Eventos consumidos
- `GoodsReceived`
- `JournalEntryPosted`

## Métricas
- `assets_active`
- `depreciation_run_seconds`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

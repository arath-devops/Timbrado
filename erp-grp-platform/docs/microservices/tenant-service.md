# `tenant-service`

| Campo | Valor |
|-------|-------|
| Capa | core |
| Responsabilidad | Ciclo de vida de tenants, licencias y onboarding |
| Base de datos | PostgreSQL schema/database `tenant_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | Baja escala; HA crítica |

## APIs
- `POST /api/v1/tenants`
- `GET /api/v1/tenants/{id}`
- `POST /api/v1/tenants/{id}/modules`

## Eventos publicados
- `TenantCreated`
- `TenantSuspended`
- `ModuleLicenseChanged`

## Eventos consumidos
-_(ninguno)_

## Métricas
- `tenants_active`
- `onboarding_duration`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

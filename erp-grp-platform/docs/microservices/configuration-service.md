# `configuration-service`

| Campo | Valor |
|-------|-------|
| Capa | core |
| Responsabilidad | Feature flags, parámetros por tenant |
| Base de datos | PostgreSQL schema/database `configuration_db` |
| Dependencias | `PostgreSQL`, `Redis`, `Kafka` |
| Escalabilidad | Baja escala; cache agresivo |

## APIs
- `GET /api/v1/config/{tenantId}`
- `PUT /api/v1/config/{tenantId}/modules`

## Eventos publicados
- `ConfigurationChanged`
- `ModuleToggled`

## Eventos consumidos
- `TenantCreated`

## Métricas
- `config_reads`
- `flag_evaluations`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

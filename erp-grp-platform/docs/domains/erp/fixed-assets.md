# Activos Fijos

**Microservicio:** `fixed-assets-service`

## Responsabilidad
Gestionar el bounded context **Activos Fijos** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Activos Fijos`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `ActivosFijosCreated`
- `ActivosFijosUpdated`
- `ActivosFijosStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

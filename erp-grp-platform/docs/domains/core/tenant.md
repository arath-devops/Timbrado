# Tenant / Licenciamiento

**Microservicio:** `tenant-service`

## Responsabilidad
Gestionar el bounded context **Tenant / Licenciamiento** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Tenant / Licenciamiento`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `Tenant/LicenciamientoCreated`
- `Tenant/LicenciamientoUpdated`
- `Tenant/LicenciamientoStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

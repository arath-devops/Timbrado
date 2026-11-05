# Control Gubernamental

**Microservicio:** `gov-control-service`

## Responsabilidad
Gestionar el bounded context **Control Gubernamental** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Control Gubernamental`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `ControlGubernamentalCreated`
- `ControlGubernamentalUpdated`
- `ControlGubernamentalStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

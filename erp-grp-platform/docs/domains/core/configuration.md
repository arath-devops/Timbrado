# Configuración

**Microservicio:** `configuration-service`

## Responsabilidad
Gestionar el bounded context **Configuración** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Configuración`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `ConfiguraciónCreated`
- `ConfiguraciónUpdated`
- `ConfiguraciónStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

# Logística

**Microservicio:** `logistics-service`

## Responsabilidad
Gestionar el bounded context **Logística** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Logística`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `LogísticaCreated`
- `LogísticaUpdated`
- `LogísticaStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

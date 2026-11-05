# Fiscalización

**Microservicio:** `oversight-service`

## Responsabilidad
Gestionar el bounded context **Fiscalización** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Fiscalización`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `FiscalizaciónCreated`
- `FiscalizaciónUpdated`
- `FiscalizaciónStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

# Expediente Electrónico

**Microservicio:** `electronic-file-service`

## Responsabilidad
Gestionar el bounded context **Expediente Electrónico** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Expediente Electrónico`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `ExpedienteElectrónicoCreated`
- `ExpedienteElectrónicoUpdated`
- `ExpedienteElectrónicoStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

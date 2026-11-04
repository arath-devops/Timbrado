# Gestión Documental

**Microservicio:** `document-service`

## Responsabilidad
Gestionar el bounded context **Gestión Documental** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Gestión Documental`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `GestiónDocumentalCreated`
- `GestiónDocumentalUpdated`
- `GestiónDocumentalStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

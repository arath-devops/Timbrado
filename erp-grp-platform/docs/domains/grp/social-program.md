# Programas Sociales

**Microservicio:** `social-program-service`

## Responsabilidad
Gestionar el bounded context **Programas Sociales** con APIs REST, eventos Kafka y persistencia PostgreSQL propia.

## Agregados (mínimo)
- Root aggregate del dominio `Programas Sociales`
- Entidades hijas según reglas de negocio
- VOs: `Money`, `TenantId`, `AuditMeta`

## Eventos
- `ProgramasSocialesCreated`
- `ProgramasSocialesUpdated`
- `ProgramasSocialesStatusChanged`

## Casos de uso principales
- Alta / cambio / baja
- Consultas CQRS
- Integración vía eventos con dominios adyacentes

## Dependencias
- `iam-service`, `audit-service`, `catalog-service`, `workflow-service` (si aplica aprobaciones)

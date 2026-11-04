# Auditoría

**Microservicio:** `audit-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Registrar hecho
- Consultar trail
- Verificar integridad hash chain

## Agregados y Entidades

### Agregado `AuditFact`
- **Descripción:** Hecho auditable
- **Atributos clave:** actor, action, entity, before, after, hash

### Agregado `AuditTrail`
- **Descripción:** Cadena de hechos
- **Atributos clave:** entityType, entityId


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `AuditFactRecorded`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

# RRHH

**Microservicio:** `hr-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Alta de empleado
- Cambio de plaza
- Baja

## Agregados y Entidades

### Agregado `Employee`
- **Descripción:** Empleado
- **Atributos clave:** personId, position, status

### Agregado `Position`
- **Descripción:** Plaza
- **Atributos clave:** code, grade, orgUnit

### Agregado `Contract`
- **Descripción:** Contrato laboral
- **Atributos clave:** type, start, end


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `EmployeeCreated`
- `EmployeeUpdated`
- `EmployeeTerminated`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

# Gestión Ciudadana

**Microservicio:** `citizen-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Registrar ciudadano
- Abrir trámite
- Agendar cita
- Resolver solicitud

## Agregados y Entidades

### Agregado `Citizen`
- **Descripción:** Ciudadano
- **Atributos clave:** curp, name, contacts

### Agregado `ServiceRequest`
- **Descripción:** Solicitud de trámite
- **Atributos clave:** type, status

### Agregado `Appointment`
- **Descripción:** Cita
- **Atributos clave:** slot, office


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `CitizenRegistered`
- `ServiceRequestOpened`
- `ServiceRequestClosed`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

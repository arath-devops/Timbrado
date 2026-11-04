# Contrataciones Públicas

**Microservicio:** `procurement-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Publicar procedimiento
- Recibir propuestas
- Adjudicar
- Formalizar contrato
- Integrar a compras ERP

## Agregados y Entidades

### Agregado `ProcurementProcedure`
- **Descripción:** Procedimiento
- **Atributos clave:** type, status, amount

### Agregado `Bid`
- **Descripción:** Propuesta
- **Atributos clave:** vendor, amount

### Agregado `Award`
- **Descripción:** Adjudicación
- **Atributos clave:** winner, amount

### Agregado `PublicContract`
- **Descripción:** Contrato público
- **Atributos clave:** awardId, terms


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `ProcedurePublished`
- `BidReceived`
- `AwardGranted`
- `PublicContractSigned`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

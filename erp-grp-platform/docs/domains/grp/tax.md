# Recaudación

**Microservicio:** `tax-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Padronar contribuyente
- Emitir liquidación
- Registrar pago
- Generar rezagos

## Agregados y Entidades

### Agregado `Taxpayer`
- **Descripción:** Contribuyente
- **Atributos clave:** rfc, type, status

### Agregado `TaxAssessment`
- **Descripción:** Liquidación
- **Atributos clave:** concept, amount, dueDate

### Agregado `TaxPayment`
- **Descripción:** Pago de contribución
- **Atributos clave:** assessmentId, amount, channel


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `TaxpayerRegistered`
- `TaxAssessmentIssued`
- `TaxPaymentReceived`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

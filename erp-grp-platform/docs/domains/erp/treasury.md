# Tesorería

**Microservicio:** `treasury-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Programar pago
- Ejecutar dispersión
- Conciliar extracto
- Registrar cobro

## Agregados y Entidades

### Agregado `BankAccount`
- **Descripción:** Cuenta bancaria
- **Atributos clave:** iban, currency, balance

### Agregado `PaymentOrder`
- **Descripción:** Orden de pago
- **Atributos clave:** beneficiary, amount, status

### Agregado `Collection`
- **Descripción:** Cobro
- **Atributos clave:** payer, amount, channel

### Agregado `BankReconciliation`
- **Descripción:** Conciliación bancaria
- **Atributos clave:** statementId, matches


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `PaymentOrderCreated`
- `PaymentExecuted`
- `BankReconciled`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

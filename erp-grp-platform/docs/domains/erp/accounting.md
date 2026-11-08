# Contabilidad

**Microservicio:** `accounting-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Crear asiento
- Contabilizar asiento
- Extornar asiento
- Emitir balanza

## Agregados y Entidades

### Agregado `ChartOfAccounts`
- **Descripción:** Plan de cuentas
- **Atributos clave:** id, version, accounts

### Agregado `Account`
- **Descripción:** Cuenta contable
- **Atributos clave:** code, name, type, nature

### Agregado `JournalEntry`
- **Descripción:** Asiento contable
- **Atributos clave:** number, date, lines, status

### Agregado `FiscalPeriod`
- **Descripción:** Periodo fiscal
- **Atributos clave:** year, status


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `JournalEntryPosted`
- `JournalEntryReversed`
- `FiscalPeriodClosed`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

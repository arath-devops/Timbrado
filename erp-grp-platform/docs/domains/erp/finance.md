# Finanzas

**Microservicio:** `finance-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Registrar centro de costos
- Actualizar tipo de cambio
- Cerrar periodo financiero
- Consultar ejecución vs presupuesto

## Agregados y Entidades

### Agregado `CostCenter`
- **Descripción:** Centro de costos / unidad responsable
- **Atributos clave:** id, code, name, parentId, status

### Agregado `FinancialPeriod`
- **Descripción:** Periodo financiero abierto/cerrado
- **Atributos clave:** id, year, month, status

### Agregado `ExchangeRate`
- **Descripción:** Tipo de cambio multimoneda
- **Atributos clave:** from, to, rate, validFrom

### Agregado `BudgetVsActual`
- **Descripción:** Comparativo financiero (read model)
- **Atributos clave:** costCenter, period, budget, actual


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `CostCenterCreated`
- `ExchangeRateUpdated`
- `PeriodClosed`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

# Presupuesto Público

**Microservicio:** `budget-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Cargar anteproyecto
- Aprobar presupuesto
- Comprometer
- Devengar
- Ejercer
- Modificar ampliación/reducción

## Agregados y Entidades

### Agregado `BudgetCycle`
- **Descripción:** Ciclo presupuestario
- **Atributos clave:** year, status

### Agregado `BudgetAllocation`
- **Descripción:** Asignación / partida
- **Atributos clave:** clave, authorized, committed, accrued, paid

### Agregado `BudgetMovement`
- **Descripción:** Movimiento
- **Atributos clave:** type, amount, ref


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `BudgetApproved`
- `BudgetCommitted`
- `BudgetAccrued`
- `BudgetPaid`
- `BudgetModified`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

# Nómina

**Microservicio:** `payroll-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Cargar incidencias
- Calcular nómina
- Aprobar
- Timbrar/dispersar

## Agregados y Entidades

### Agregado `PayrollRun`
- **Descripción:** Corrida de nómina
- **Atributos clave:** period, status, totals

### Agregado `Payslip`
- **Descripción:** Recibo
- **Atributos clave:** employeeId, earnings, deductions, net

### Agregado `Incidence`
- **Descripción:** Incidencia
- **Atributos clave:** employeeId, type, amount


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `PayrollRunCreated`
- `PayrollApproved`
- `PayrollClosed`
- `PayslipGenerated`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

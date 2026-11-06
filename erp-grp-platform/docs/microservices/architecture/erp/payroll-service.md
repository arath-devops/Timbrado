# `payroll-service`
## SA-MS-001 · Capa **ERP** · Prioridad: **OUT-F1**

### Responsabilidad
Corridas de nómina: cálculo, aprobación, recibos y disparo de afectaciones a presupuesto/contabilidad/tesorería.

### Límites (Bounded Context)

**Posee / es dueño de:**
- PayrollRun
- Payslip
- PayrollRuleSet binding

**No posee / no debe hacer:**
- Maestro empleado (hr-service)
- Ejecución bancaria (treasury)
- UI de presupuesto

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/payroll-runs` | Crear corrida |
| `POST` | `/api/v1/payroll-runs/{id}/calculate` | Calcular |
| `POST` | `/api/v1/payroll-runs/{id}/submit` | Enviar aprobación |
| `GET` | `/api/v1/payslips/{id}` | Recibo |
| `POST` | `/api/v1/payroll-runs/{id}/close` | Cerrar |

### Eventos publicados
- `PayrollRunCreated`
- `PayrollCalculated`
- `PayrollApproved`
- `PayslipGenerated`
- `PayrollClosed`

### Eventos consumidos
- `EmployeeUpdated`
- `IncidenceRecorded`
- `ProcessCompleted(PAYROLL_APPROVAL)`
- `BudgetCommitted`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `payroll_db`
- Regla: acceso exclusivo de `payroll-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `hr-service`
- `workflow-service`
- `budget-service`
- `accounting-service`
- `treasury-service`
- `notification-service`
- `audit-service`

### Notas de contrato
**OUT-F1** según EA-DEC-001. Contratos listos; no implementar en Fase 1.

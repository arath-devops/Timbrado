# `payroll-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Cálculo, aprobación y cierre de nómina |
| Base de datos | PostgreSQL schema/database `payroll_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Redis` |
| Escalabilidad | Scale-out workers en cálculo; jobs particionados |

## APIs
- `POST /api/v1/payroll-runs`
- `POST /api/v1/payroll-runs/{id}/calculate`
- `POST /api/v1/payroll-runs/{id}/approve`

## Eventos publicados
- `PayrollRunCreated`
- `PayrollApproved`
- `PayrollClosed`
- `PayslipGenerated`

## Eventos consumidos
- `EmployeeUpdated`
- `IncidenceLoaded`
- `BudgetCommitted`

## Métricas
- `payroll_calc_seconds`
- `payslips_generated`
- `payroll_errors`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

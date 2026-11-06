# `hr-service`
## SA-MS-001 · Capa **ERP** · Prioridad: **F2+**

### Responsabilidad
Ciclo de vida de personas/empleados, plazas/positions de negocio HR, movimientos e incidencias base (no cálculo de nómina).

### Límites (Bounded Context)

**Posee / es dueño de:**
- Employee
- Position (HR)
- Contract
- Incidence

**No posee / no debe hacer:**
- Cálculo y payslips (payroll-service)
- Usuarios IAM (puede emitir eventos para provisioning)
- Pagos

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/employees` | Alta |
| `GET` | `/api/v1/employees/{id}` | Detalle |
| `PUT` | `/api/v1/employees/{id}` | Actualizar |
| `POST` | `/api/v1/employees/{id}/terminate` | Baja |
| `POST` | `/api/v1/positions` | Plaza |
| `POST` | `/api/v1/incidences` | Incidencia |

### Eventos publicados
- `EmployeeCreated`
- `EmployeeUpdated`
- `EmployeeTerminated`
- `IncidenceRecorded`
- `PositionCreated`

### Eventos consumidos
- `ProcessCompleted(HR_MOVEMENT_APPROVAL)`
- `OrgUnitChanged`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `hr_db`
- Regla: acceso exclusivo de `hr-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `workflow-service`
- `document-service`
- `catalog-service`
- `audit-service`

### Notas de contrato
EmployeeTerminated → IAM puede lockear. OUT de montos de nómina.

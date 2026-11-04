# `hr-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Empleados, plazas, contratos, organigrama |
| Base de datos | PostgreSQL schema/database `hr_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | Escala media; picos de carga masiva |

## APIs
- `POST /api/v1/employees`
- `PUT /api/v1/employees/{id}`
- `POST /api/v1/positions`

## Eventos publicados
- `EmployeeCreated`
- `EmployeeUpdated`
- `EmployeeTerminated`

## Eventos consumidos
- `ProcessCompleted`

## Métricas
- `employees_active`
- `hires_total`
- `terminations_total`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

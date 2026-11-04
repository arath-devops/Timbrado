# `workflow-service`

| Campo | Valor |
|-------|-------|
| Capa | core |
| Responsabilidad | Motor de aprobaciones y procesos BPMN/DSL |
| Base de datos | PostgreSQL schema/database `workflow_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Redis` |
| Escalabilidad | HPA + particiones por tenant |

## APIs
- `POST /api/v1/processes`
- `POST /api/v1/tasks/{id}/complete`
- `GET /api/v1/tasks/inbox`

## Eventos publicados
- `ProcessStarted`
- `TaskCompleted`
- `ProcessCompleted`
- `ProcessCancelled`

## Eventos consumidos
- `*ApprovalRequested`

## Métricas
- `open_tasks`
- `process_duration_seconds`
- `sla_breaches`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

# `notification-service`

| Campo | Valor |
|-------|-------|
| Capa | core |
| Responsabilidad | Email/SMS/Push/In-app multi-canal |
| Base de datos | PostgreSQL schema/database `notification_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Redis` |
| Escalabilidad | KEDA Kafka lag; workers por canal |

## APIs
- `POST /api/v1/notifications`
- `GET /api/v1/notifications/inbox`

## Eventos publicados
- `NotificationSent`
- `NotificationFailed`

## Eventos consumidos
- `*NotificationRequested`
- `PayslipGenerated`
- `ServiceRequestClosed`

## Métricas
- `notifications_sent_total`
- `channel_error_rate`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

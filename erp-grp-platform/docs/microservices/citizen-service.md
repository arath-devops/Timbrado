# `citizen-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Ciudadanos, trámites y citas |
| Base de datos | PostgreSQL schema/database `citizen_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Elasticsearch` |
| Escalabilidad | HPA alta portal público |

## APIs
- `POST /api/v1/citizens`
- `POST /api/v1/service-requests`
- `POST /api/v1/appointments`

## Eventos publicados
- `CitizenRegistered`
- `ServiceRequestOpened`
- `ServiceRequestClosed`

## Eventos consumidos
- `TaxPaymentReceived`
- `DocumentUploaded`
- `ProcessCompleted`

## Métricas
- `requests_open`
- `sla_compliance`
- `citizens_registered`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

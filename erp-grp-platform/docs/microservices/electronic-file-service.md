# `electronic-file-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Expediente electrónico y actuaciones |
| Base de datos | PostgreSQL schema/database `electronic_file_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `ObjectStorage` |
| Escalabilidad | HPA + storage |

## APIs
- `POST /api/v1/files`
- `POST /api/v1/files/{id}/actions`
- `GET /api/v1/files/{id}`

## Eventos publicados
- `ElectronicFileOpened`
- `ActionRecorded`
- `ElectronicFileClosed`

## Eventos consumidos
- `ServiceRequestOpened`
- `DocumentUploaded`

## Métricas
- `files_open`
- `actions_total`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

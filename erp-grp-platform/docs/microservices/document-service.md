# `document-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Gestión documental, versiones y firma |
| Base de datos | PostgreSQL schema/database `document_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `ObjectStorage`, `Antivirus` |
| Escalabilidad | HPA I/O; virus scan async |

## APIs
- `POST /api/v1/documents`
- `GET /api/v1/documents/{id}`
- `POST /api/v1/documents/{id}/sign`

## Eventos publicados
- `DocumentUploaded`
- `DocumentSigned`
- `DocumentVersioned`

## Eventos consumidos
- `ElectronicFileOpened`
- `ProcedurePublished`

## Métricas
- `documents_stored`
- `sign_latency`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

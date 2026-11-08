# `transparency-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Obligaciones de transparencia y publicación |
| Base de datos | PostgreSQL schema/database `transparency_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `ObjectStorage` |
| Escalabilidad | Escala media lecturas públicas |

## APIs
- `POST /api/v1/obligations`
- `POST /api/v1/publications`
- `GET /api/v1/publications`

## Eventos publicados
- `ObligationPublished`
- `PublicationUpdated`

## Eventos consumidos
- `BudgetApproved`
- `AwardGranted`
- `ContractSigned`

## Métricas
- `publications_total`
- `obligation_sla_breaches`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

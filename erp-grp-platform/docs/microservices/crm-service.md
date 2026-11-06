# `crm-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Leads, oportunidades y cuentas comerciales |
| Base de datos | PostgreSQL schema/database `crm_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Elasticsearch` |
| Escalabilidad | HPA lectura ES |

## APIs
- `POST /api/v1/leads`
- `POST /api/v1/opportunities`
- `GET /api/v1/accounts`

## Eventos publicados
- `LeadCreated`
- `OpportunityWon`
- `OpportunityLost`

## Eventos consumidos
- `InvoiceGenerated`
- `CitizenRegistered`

## Métricas
- `pipeline_value`
- `conversion_rate`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

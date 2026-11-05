# `tax-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Padrón, liquidaciones y pagos de contribuciones |
| Base de datos | PostgreSQL schema/database `tax_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Elasticsearch` |
| Escalabilidad | HPA + búsqueda ES |

## APIs
- `POST /api/v1/taxpayers`
- `POST /api/v1/assessments`
- `POST /api/v1/payments`

## Eventos publicados
- `TaxpayerRegistered`
- `TaxAssessmentIssued`
- `TaxPaymentReceived`

## Eventos consumidos
- `CitizenRegistered`
- `PaymentExecuted`

## Métricas
- `assessments_issued`
- `collection_rate`
- `delinquency_amount`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

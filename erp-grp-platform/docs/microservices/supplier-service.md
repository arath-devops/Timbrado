# `supplier-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Maestro de proveedores y evaluación |
| Base de datos | PostgreSQL schema/database `supplier_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | Escala media |

## APIs
- `POST /api/v1/suppliers`
- `GET /api/v1/suppliers/{id}`
- `POST /api/v1/suppliers/{id}/evaluate`

## Eventos publicados
- `SupplierCreated`
- `SupplierStatusChanged`
- `SupplierEvaluated`

## Eventos consumidos
- `InvoiceMatched`
- `AwardGranted`

## Métricas
- `suppliers_active`
- `evaluation_score_avg`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

# `logistics-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Embarques, rutas y entregas |
| Base de datos | PostgreSQL schema/database `logistics_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | Escala media |

## APIs
- `POST /api/v1/shipments`
- `GET /api/v1/routes`
- `POST /api/v1/deliveries`

## Eventos publicados
- `ShipmentCreated`
- `DeliveryCompleted`

## Eventos consumidos
- `SalesOrderConfirmed`
- `StockTransferred`

## Métricas
- `on_time_delivery_ratio`
- `shipments_in_transit`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

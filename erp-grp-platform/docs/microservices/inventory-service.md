# `inventory-service`

| Campo | Valor |
|-------|-------|
| Capa | erp |
| Responsabilidad | Existencias, movimientos, valuación |
| Base de datos | PostgreSQL schema/database `inventory_db` |
| Dependencias | `PostgreSQL`, `Kafka`, `Redis` |
| Escalabilidad | HPA + locks optimistas/Redis |

## APIs
- `POST /api/v1/movements`
- `GET /api/v1/stock`
- `POST /api/v1/transfers`

## Eventos publicados
- `StockIncreased`
- `StockDecreased`
- `StockTransferred`

## Eventos consumidos
- `GoodsReceived`
- `SalesOrderConfirmed`

## Métricas
- `stock_movements_total`
- `negative_stock_attempts`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

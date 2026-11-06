# `inventory-service`
## SA-MS-001 · Capa **ERP** · Prioridad: **F2+**

### Responsabilidad
Existencias por almacén/SKU, movimientos, traspasos, ajustes y valuación básica.

### Límites (Bounded Context)

**Posee / es dueño de:**
- Warehouse
- StockItem
- StockMovement
- ValuationPolicy

**No posee / no debe hacer:**
- OC (solo reacciona a GoodsReceived)
- Contabilidad de costo (emite eventos)

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/warehouses` | Alta almacén |
| `POST` | `/api/v1/items` | Alta SKU stock |
| `GET` | `/api/v1/stock` | Consulta existencias |
| `POST` | `/api/v1/movements` | Movimiento |
| `POST` | `/api/v1/transfers` | Traspaso |
| `POST` | `/api/v1/adjustments` | Ajuste (con WF si umbral) |

### Eventos publicados
- `StockIncreased`
- `StockDecreased`
- `StockTransferred`
- `StockAdjusted`

### Eventos consumidos
- `GoodsReceived`
- `SalesIssued (futuro)`
- `ProcessCompleted(STOCK_ADJUST_APPROVAL)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `inventory_db`
- Regla: acceso exclusivo de `inventory-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `catalog-service`
- `workflow-service`
- `audit-service`
- `accounting-service (events)`

### Notas de contrato
No stock negativo salvo policy. Idempotencia por receipt line.

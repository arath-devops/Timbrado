# Inventarios

**Microservicio:** `inventory-service`  
**Lenguaje ubicuo:** ver arquitectura de dominios.

## Casos de uso
- Entrada por compra
- Salida por venta/consumo
- Transferencia entre almacenes

## Agregados y Entidades

### Agregado `Warehouse`
- **Descripción:** Almacén
- **Atributos clave:** code, location

### Agregado `StockItem`
- **Descripción:** Existencia
- **Atributos clave:** sku, qty, warehouse

### Agregado `StockMovement`
- **Descripción:** Movimiento
- **Atributos clave:** type, qty, ref


## Value Objects comunes
- `Money` {amount, currency}
- `TenantId`
- `AuditMeta` {createdBy, createdAt, modifiedBy, modifiedAt, version}
- `LocalizedText` {locale, value}


## Eventos de dominio publicados
- `StockIncreased`
- `StockDecreased`
- `StockTransferred`

## Dependencias
- Upstream: `iam-service`, `catalog-service`, `audit-service`
- Event bus: Kafka topics del dominio

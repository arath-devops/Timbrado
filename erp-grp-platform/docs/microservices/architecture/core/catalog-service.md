# `catalog-service`
## SA-MS-001 · Capa **Core** · Prioridad: **MVP**

### Responsabilidad
Administrar catálogos maestros versionados multiidioma (incl. OrgUnit types items, UoM, document types, thresholds labels, etc.).

### Límites (Bounded Context)

**Posee / es dueño de:**
- Catalog
- CatalogItem
- i18n labels
- item status/version

**No posee / no debe hacer:**
- Transacciones de compra/presupuesto
- Organigrama completo (puede catalogar tipos; OU vive en iam/org o servicio org embebido en IAM/config)

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/catalogs/{code}` | Obtener catálogo |
| `GET` | `/api/v1/catalogs/{code}/items` | Listar ítems |
| `POST` | `/api/v1/catalogs/{code}/items` | Alta ítem |
| `PUT` | `/api/v1/catalogs/{code}/items/{itemCode}` | Actualizar |
| `POST` | `/api/v1/catalogs/{code}/items/{itemCode}/deprecate` | Deprecar |

### Eventos publicados
- `CatalogCreated`
- `CatalogItemAdded`
- `CatalogItemUpdated`
- `CatalogItemDeprecated`

### Eventos consumidos
- `TenantCreated (seed catalogs)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `catalog_db`
- Regla: acceso exclusivo de `catalog-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version` (optimistic lock)

### Dependencias
- `PostgreSQL`
- `Redis (cache)`
- `Kafka`
- `IAM`

### Notas de contrato
OHS de lectura masiva. Cache-aside Redis. Ítems deprecated no referenciables en nuevas txs.

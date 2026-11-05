# `finance-service`
## SA-MS-001 · Capa **ERP** · Prioridad: **F2+**

### Responsabilidad
Estructura financiera analítica: centros de costo/unidades responsables financieras, periodos de gestión, tipos de cambio y dimensiones previas a contabilidad detallada.

### Límites (Bounded Context)

**Posee / es dueño de:**
- CostCenter
- FinancialPeriod
- ExchangeRate
- FinancialDimension

**No posee / no debe hacer:**
- Asientos contables
- Saldos presupuestales públicos
- Órdenes de compra

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/cost-centers` | Alta centro de costo |
| `GET` | `/api/v1/cost-centers` | Listar |
| `POST` | `/api/v1/periods` | Abrir periodo |
| `POST` | `/api/v1/periods/{id}/close` | Cerrar periodo |
| `PUT` | `/api/v1/exchange-rates` | Upsert FX |
| `GET` | `/api/v1/exchange-rates` | Consultar FX |

### Eventos publicados
- `CostCenterCreated`
- `CostCenterUpdated`
- `FinancialPeriodClosed`
- `ExchangeRateUpdated`

### Eventos consumidos
- `OrgUnitChanged (si sync desde org)`
- `JournalEntryPosted (read models opcionales)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `finance_db`
- Regla: acceso exclusivo de `finance-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `catalog-service`
- `audit-service`

### Notas de contrato
No es dueño de BudgetKey pública. Puede mapear CostCenter↔OrgUnit por ID.

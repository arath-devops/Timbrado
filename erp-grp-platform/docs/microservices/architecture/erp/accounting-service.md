# `accounting-service`
## SA-MS-001 · Capa **ERP** · Prioridad: **F1 parcial**

### Responsabilidad
System of Record contable: plan de cuentas, asientos de partida doble, posteo, extornos, periodos fiscales y balanzas.

### Límites (Bounded Context)

**Posee / es dueño de:**
- ChartOfAccounts
- Account
- JournalEntry
- FiscalPeriod

**No posee / no debe hacer:**
- Pagos bancarios
- Compromisos presupuestales
- Inventario físico

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/accounts` | Alta cuenta |
| `GET` | `/api/v1/accounts` | Plan de cuentas |
| `POST` | `/api/v1/journals` | Crear asiento |
| `POST` | `/api/v1/journals/{id}/post` | Contabilizar |
| `POST` | `/api/v1/journals/{id}/reverse` | Extornar |
| `GET` | `/api/v1/trial-balance` | Balanza |
| `POST` | `/api/v1/fiscal-periods/{id}/close` | Cerrar periodo fiscal |

### Eventos publicados
- `JournalEntryPosted`
- `JournalEntryReversed`
- `FiscalPeriodClosed`

### Eventos consumidos
- `InvoiceMatched`
- `PaymentExecuted`
- `GoodsReceived`
- `PayrollApproved`
- `AssetDepreciated`
- `BudgetAccrued (opcional bridge)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `accounting_db`
- Regla: acceso exclusivo de `accounting-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `catalog-service`
- `workflow-service (cierres)`
- `audit-service`

### Notas de contrato
Invariante débitos=créditos al postear. Integraciones idempotentes. OUT de sobrescribir posted.

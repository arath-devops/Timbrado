# `budget-service`
## SA-MS-001 · Capa **GRP** · Prioridad: **MVP + F1**

### Responsabilidad
Presupuesto público: ciclos, partidas/allocations, disponibilidad, momentos compromiso/devengado/pagado, modificaciones y congelamiento.

### Límites (Bounded Context)

**Posee / es dueño de:**
- BudgetCycle
- BudgetAllocation
- BudgetMovement
- Availability read model

**No posee / no debe hacer:**
- OC (procurement-service)
- Asientos
- Expedientes

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/cycles` | Crear ciclo |
| `POST` | `/api/v1/cycles/{id}/approve` | Aprobar presupuesto |
| `POST` | `/api/v1/allocations` | Activar/crear partida |
| `GET` | `/api/v1/allocations/{id}` | Detalle |
| `GET` | `/api/v1/availability` | Disponibilidad |
| `POST` | `/api/v1/movements/commit` | Comprometer (Idempotency-Key) |
| `POST` | `/api/v1/movements/accrue` | Devengar |
| `POST` | `/api/v1/movements/pay` | Ejercer/pagar |
| `POST` | `/api/v1/movements/release` | Liberar compromiso |
| `POST` | `/api/v1/allocations/{id}/modify` | Modificar |
| `POST` | `/api/v1/allocations/{id}/freeze` | Congelar |

### Eventos publicados
- `BudgetCycleCreated`
- `BudgetApproved`
- `BudgetAllocationActivated`
- `BudgetCommitted`
- `BudgetCommitFailed`
- `BudgetAccrued`
- `BudgetPaid`
- `BudgetCommitmentReleased`
- `BudgetModified`
- `BudgetAllocationFrozen`

### Eventos consumidos
- `PurchaseOrderSubmitted/Cancelled (vía API sync preferida + eventos)`
- `GoodsReceived`
- `InvoiceMatched`
- `PaymentExecuted`
- `PayrollApproved`
- `ProcessCompleted(BUDGET_*)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `budget_db`
- Regla: acceso exclusivo de `budget-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Redis (availability cache)`
- `Kafka`
- `IAM`
- `workflow-service`
- `catalog-service`
- `document-service`
- `audit-service`
- `notification-service`

### Notas de contrato
Invariante authorized≥committed≥accrued≥paid. Commit sync desde procurement. Único dueño de fondos públicos.

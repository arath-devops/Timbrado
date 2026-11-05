# `treasury-service`
## SA-MS-001 · Capa **ERP** · Prioridad: **F1 parcial**

### Responsabilidad
Liquidez: cuentas bancarias, órdenes de pago, cobros, conciliación y disparo de ejecución de pagos.

### Límites (Bounded Context)

**Posee / es dueño de:**
- BankAccount
- PaymentOrder
- Collection
- BankReconciliation

**No posee / no debe hacer:**
- Liquidaciones fiscales (tax-service)
- Asiento contable (lo publica por evento a accounting)
- Compromiso presupuestal (budget)

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/bank-accounts` | Alta cuenta |
| `POST` | `/api/v1/payments` | Programar pago |
| `POST` | `/api/v1/payments/{id}/approve` | Aprobar |
| `POST` | `/api/v1/payments/{id}/execute` | Ejecutar |
| `POST` | `/api/v1/collections` | Registrar cobro |
| `POST` | `/api/v1/reconciliations` | Conciliar |

### Eventos publicados
- `PaymentOrderCreated`
- `PaymentApproved`
- `PaymentExecuted`
- `PaymentFailed`
- `CollectionRegistered`
- `BankReconciled`

### Eventos consumidos
- `InvoiceMatched`
- `PayrollApproved`
- `TaxPaymentReceived`
- `ProcessCompleted(PAYMENT_APPROVAL)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `treasury_db`
- Regla: acceso exclusivo de `treasury-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `workflow-service`
- `budget-service (PayBudget sync/async)`
- `accounting-service (events)`
- `notification-service`
- `audit-service`
- `Bank adapters`

### Notas de contrato
Execute payment = MFA/step-up + SoD. Tras execute → eventos a accounting y budget.

# `tax-service`
## SA-MS-001 · Capa **GRP** · Prioridad: **OUT-F1**

### Responsabilidad
Recaudación: contribuyentes, liquidaciones, líneas de captura, pagos de contribuciones, rezagos y convenios.

### Límites (Bounded Context)

**Posee / es dueño de:**
- Taxpayer
- TaxAssessment
- TaxPayment
- Delinquency
- PaymentPlan

**No posee / no debe hacer:**
- Conciliación bancaria global (treasury)
- Trámites ciudadanos genéricos

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/taxpayers` | Padronar |
| `POST` | `/api/v1/assessments` | Emitir liquidación |
| `GET` | `/api/v1/assessments/{id}` | Detalle |
| `POST` | `/api/v1/payments` | Registrar pago contribución |
| `POST` | `/api/v1/payment-plans` | Convenio |
| `POST` | `/api/v1/delinquencies/run` | Calcular rezagos |

### Eventos publicados
- `TaxpayerRegistered`
- `TaxAssessmentIssued`
- `TaxPaymentReceived`
- `DelinquencyCalculated`
- `PaymentPlanCreated`

### Eventos consumidos
- `PaymentExecuted (si canal treasury)`
- `CitizenRegistered`
- `CollectionRegistered`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `tax_db`
- Regla: acceso exclusivo de `tax-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `Elasticsearch`
- `IAM`
- `treasury-service`
- `document-service`
- `notification-service`
- `audit-service`
- `catalog-service`

### Notas de contrato
**OUT-F1**. Idempotencia fuerte en pagos.

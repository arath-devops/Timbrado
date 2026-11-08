# `social-program-service`
## SA-MS-001 · Capa **GRP** · Prioridad: **OUT-F1**

### Responsabilidad
Programas sociales: diseño de reglas, padrones, elegibilidad, asignación y solicitud de dispersión.

### Límites (Bounded Context)

**Posee / es dueño de:**
- SocialProgram
- BeneficiaryEnrollment
- BenefitAward

**No posee / no debe hacer:**
- Pago bancario (treasury)
- Fondos (budget commit)
- Identidad ciudadana maestra (puede referenciar citizenId)

### API (OpenAPI `/api/v1`)

| Método | Path | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/programs` | Crear programa |
| `POST` | `/api/v1/programs/{id}/beneficiaries` | Enrolar |
| `POST` | `/api/v1/awards` | Asignar beneficio |
| `POST` | `/api/v1/awards/{id}/submit-disbursement` | Solicitar dispersión |

### Eventos publicados
- `BeneficiaryEnrolled`
- `BenefitAwarded`
- `BenefitDisbursementRequested`
- `BenefitDisbursed`

### Eventos consumidos
- `CitizenRegistered`
- `PaymentExecuted`
- `BudgetCommitted`
- `ProcessCompleted(SOCIAL_DISBURSEMENT_APPROVAL)`

### Base de datos
- Motor: **PostgreSQL**
- Database/schema: `social_program_db`
- Regla: acceso exclusivo de `social-program-service`; migraciones Flyway propias
- Campos mínimos: `id`, `tenant_id`, auditoría, `version`

### Dependencias
- `PostgreSQL`
- `Kafka`
- `IAM`
- `budget-service`
- `treasury-service`
- `citizen-service`
- `workflow-service`
- `document-service`
- `audit-service`

### Notas de contrato
**OUT-F1**.

# `social-program-service`

| Campo | Valor |
|-------|-------|
| Capa | grp |
| Responsabilidad | Padrones y beneficios de programas sociales |
| Base de datos | PostgreSQL schema/database `social_program_db` |
| Dependencias | `PostgreSQL`, `Kafka` |
| Escalabilidad | HPA en ventanas de pago |

## APIs
- `POST /api/v1/programs`
- `POST /api/v1/beneficiaries`
- `POST /api/v1/disbursements`

## Eventos publicados
- `BeneficiaryEnrolled`
- `BenefitDisbursed`

## Eventos consumidos
- `CitizenRegistered`
- `BudgetCommitted`
- `PaymentExecuted`

## Métricas
- `beneficiaries_active`
- `disbursement_amount`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

# `iam-service`

| Campo | Valor |
|-------|-------|
| Capa | core |
| Responsabilidad | Autenticación OIDC/OAuth2, usuarios, roles, MFA, SSO, emisión JWT |
| Base de datos | PostgreSQL schema/database `iam_db` |
| Dependencias | `PostgreSQL`, `Redis`, `Kafka` |
| Escalabilidad | HPA CPU+RPS; 8-30 pods; sticky no requerida (JWT stateless) |

## APIs
- `POST /oauth2/token`
- `GET /api/v1/users`
- `POST /api/v1/users`
- `GET /api/v1/roles`
- `POST /api/v1/mfa/verify`

## Eventos publicados
- `UserCreated`
- `UserLocked`
- `RoleAssigned`
- `SessionRevoked`

## Eventos consumidos
- `TenantCreated`
- `ModuleLicenseChanged`

## Métricas
- `login_success_total`
- `login_failure_total`
- `mfa_challenge_total`
- `active_sessions`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

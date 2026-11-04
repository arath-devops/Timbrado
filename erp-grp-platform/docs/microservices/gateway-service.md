# `gateway-service`

| Campo | Valor |
|-------|-------|
| Capa | edge |
| Responsabilidad | API Gateway: routing, authn relay, rate limit, BFF hooks |
| Base de datos | PostgreSQL schema/database `n/a (stateless)` |
| Dependencias | `Redis`, `IAM JWKS` |
| Escalabilidad | HPA agresivo 6-40 pods; blue/green |

## APIs
- `/* proxied routes`

## Eventos publicados
-_(ninguno)_

## Eventos consumidos
-_(ninguno)_

## Métricas
- `gateway_requests`
- `p99_latency`
- `rate_limited_total`

## Estrategia de datos
- Migraciones Flyway en `resources/db/migration`
- Campos auditoría: `created_at`, `created_by`, `modified_at`, `modified_by`, `version`, `tenant_id`
- Soft delete opcional `deleted_at` (excepto audit append-only)

## Justificación
Servicio acotado a un Bounded Context para despliegue, escalado y ownership de equipo independientes (alineado a SAP/Oracle modularidad y a Dynamics apps).

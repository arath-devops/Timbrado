# `gateway-service`

> **Fuente de verdad:** [SA-GW-001](../architecture/gateway/00-INDEX.md)

| Campo | Valor |
|-------|-------|
| Capa | edge |
| Responsabilidad | API Gateway MVP: routing `/api/v1/{service}/**`, JWT validation, tenant/correlation propagation, rate limit, error normalization |
| Base de datos | N/A (stateless); Redis para rate-limit |
| Dependencias | `iam-service` (JWKS), Redis, todos los upstream MVP |
| Escalabilidad | HPA; blue/green |

## Rutas públicas
- `POST /api/v1/iam/oauth2/token`
- `GET /api/v1/iam/oauth2/jwks`

## Rutas protegidas
`/api/v1/{iam|catalog|audit|workflow|document|procurement|budget}/**`

## Eventos
Ninguno (edge síncrono).

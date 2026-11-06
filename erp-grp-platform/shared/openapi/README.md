# OpenAPI 3.1 — Contratos MVP

| Campo | Valor |
|-------|--------|
| Estándar | OpenAPI **3.1** |
| Versión API | `/api/v1` |
| Alcance | Sprint 1 Baseline (BL-S1-001) + SA-MS-001 |
| Estado | Contratos listos para implementación (**sin código**) |

## Servicios

| Servicio | Spec |
|----------|------|
| Common (headers, errores, paginación) | [common/v1.yaml](common/v1.yaml) |
| iam-service | [iam/v1.yaml](iam/v1.yaml) |
| catalog-service | [catalog/v1.yaml](catalog/v1.yaml) |
| audit-service | [audit/v1.yaml](audit/v1.yaml) |
| workflow-service | [workflow/v1.yaml](workflow/v1.yaml) |
| document-service | [document/v1.yaml](document/v1.yaml) |
| procurement-service | [procurement/v1.yaml](procurement/v1.yaml) |
| budget-service | [budget/v1.yaml](budget/v1.yaml) |

## Convenciones transversales

| Tema | Regla |
|------|--------|
| Versionado | Breaking → `/api/v2`; additive fields = minor compatible |
| Auth | `Authorization: Bearer <JWT>` (salvo token/jwks) |
| Tenant | Claim JWT `tenant_id` (fuente de verdad). Header `X-Tenant-Id` solo local/dev |
| Correlation | `X-Correlation-Id` (UUID). Si falta en mutación, el servidor genera y echo |
| Request | `X-Request-Id` (UUID cliente). Echo en response |
| Trace | `traceparent` (W3C) y/o `X-Trace-Id` |
| Idempotencia | `Idempotency-Key` obligatorio en commit/release y comandos marcados |
| Errores | Schema `ApiError` |
| Paginación | `page` (0-based), `size` (default 20, max 100), response `Page*` |

## Referencias

- `docs/delivery/03-SPRINT-1-SCOPE-BASELINE.md`
- `docs/microservices/architecture/03-CONTRATOS-TRANSVERSALES.md`
- `docs/delivery/04-DEFINITION-OF-DONE.md` (API checklist)
